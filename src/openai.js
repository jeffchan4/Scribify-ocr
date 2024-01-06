import axios from "axios";

const makeSummarizationRequest = async (textToSummarize, sentences, apiKey) => {
  const apiUrl = "https://api.meaningcloud.com/summarization-1.0";

  try {
    const response = await axios.post(
      apiUrl,
      `key=${apiKey}&txt=${encodeURIComponent(
        textToSummarize,
      )}&sentences=${sentences}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    // Assuming the API response structure contains a 'summary' field
    console.log(response);
    const apiSummary = response.data.summary;
    console.log("Summary:", apiSummary);

    return apiSummary;
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message,
    );
    throw error; // Re-throw the error to let the caller handle it
  }
};

export default makeSummarizationRequest;
