async function sendMessage() {

    const inputField =
        document.getElementById("userInput");

    const responseBox =
        document.getElementById("response");

    const userMessage =
        inputField.value;

    if(userMessage.trim() === "") {
        return;
    }

    responseBox.innerHTML =
        "PakGuide AI is typing...";

    try {

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {

                method: "POST",

                headers: {

                    "Authorization":
                    "Bearer YOUR_API_KEY",

                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({

                    model:
                    "deepseek/deepseek-chat-v3-0324:free",

                    messages: [

                    {
                        role: "system",

                        content: `
You are PakGuide AI.

You are an intelligent tourism assistant for Pakistan.

Help tourists with:
- travel planning
- famous places
- culture
- traditional foods
- hotel suggestions
- tourist attractions
- northern areas
- family trips
- historical places

Always answer professionally.
`
                    },

                    {
                        role: "user",
                        content: userMessage
                    }

                    ]
                })
            }
        );

        const data = await response.json();

        const aiReply =
        data.choices[0].message.content;

        responseBox.innerHTML =
        aiReply;

    }

    catch(error) {

        console.log(error);

        responseBox.innerHTML =
        "Error connecting PakGuide AI.";
    }
}