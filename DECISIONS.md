- I used Express.js to create the server, MySQL as the database, Mistral AI as the LLM, and Postman for API testing.

- LLM Decides : Ticket Category , Sentiment ,  Priority , Draft Suggested Reply.

- Trade-offs & Skipped Items
    - Used direct SQL queries instead of Prisma to keep code simple and fast.
    - Skip user login/JWT only focus on core AI ticket classification.
    - Skip use of Langchain for LLM interaction and use MistralAI API directly.

- Production Next Steps
    - Add user authentication (JWT tokens).
    - Add database indexes for faster search.
    - Use Docker & kubernetes
