
const JUDGE0_URL = (
  process.env.JUDGE0_URL || "https://ce.judge0.com"
).replace(/\/$/, "");

const languageIds = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
  typescript: 74,
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const judge0Headers = {
  "Content-Type": "application/json",
  ...(process.env.JUDGE0_API_KEY
    ? { "X-RapidAPI-Key": process.env.JUDGE0_API_KEY }
    : {}),
  ...(process.env.JUDGE0_HOST
    ? { "X-RapidAPI-Host": process.env.JUDGE0_HOST }
    : {}),
};

export const executeCode = async (req, res) => {
  try {
    const { code, language, stdin = "" } = req.body;

    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({
        message: "Please provide code to execute.",
      });
    }

    if (typeof language !== "string" || !languageIds[language]) {
      return res.status(400).json({
        message: "Unsupported programming language.",
      });
    }

    if (typeof stdin !== "string") {
      return res.status(400).json({
        message: "Input must be a string.",
      });
    }

    if (Buffer.byteLength(code, "utf8") > 50000) {
      return res.status(413).json({
        message: "Code is too large. Maximum size is 50 KB.",
      });
    }

    if (Buffer.byteLength(stdin, "utf8") > 10000) {
      return res.status(413).json({
        message: "Input is too large. Maximum size is 10 KB.",
      });
    }

    const submissionResponse = await fetch(
      `${JUDGE0_URL}/submissions?base64_encoded=true&wait=false`,
      {
        method: "POST",
        headers: judge0Headers,
        body: JSON.stringify({
          source_code: Buffer.from(code, "utf8").toString("base64"),
          language_id: languageIds[language],
          stdin: Buffer.from(stdin, "utf8").toString("base64"),
        }),
        signal: AbortSignal.timeout(15000),
      }
    );

    const submission = await submissionResponse.json();

    if (!submissionResponse.ok || !submission.token) {
      return res.status(502).json({
        message:
          submission.message ||
          "Unable to submit code to the execution service.",
      });
    }

    // Poll for the result. Judge0 status IDs 1 and 2 are queued and processing.
    let result = null;

    for (let attempt = 0; attempt < 25; attempt++) {
      await sleep(1000);

      const resultResponse = await fetch(
        `${JUDGE0_URL}/submissions/${submission.token}?base64_encoded=true`,
        {
          headers: judge0Headers,
          signal: AbortSignal.timeout(10000),
        }
      );

      if (!resultResponse.ok) {
        throw new Error("Unable to retrieve execution result.");
      }

      result = await resultResponse.json();

      if (result.status?.id > 2) {
        break;
      }
    }

    if (!result || result.status?.id <= 2) {
      return res.status(202).json({
        status: "Processing",
        message: "Execution is taking longer than expected. Try again.",
      });
    }

    const decode = (value) =>
      value ? Buffer.from(value, "base64").toString("utf8") : "";

    return res.status(200).json({
      status: result.status?.description || "Completed",
      output: decode(result.stdout),
      error: decode(result.stderr),
      compileOutput: decode(result.compile_output),
      executionTime: result.time || null,
      memory: result.memory || null,
      exitCode: result.exit_code ?? null,
    });
  } catch (error) {
    console.error("Code execution error:", error);

    return res.status(502).json({
      message: error.name === "TimeoutError"
        ? "Execution service timed out. Please try again."
        : "Code execution service is currently unavailable.",
    });
  }
};
