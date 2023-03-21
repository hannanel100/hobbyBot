# HobbyBot

HobbyBot is a web application built using Next.js, TypeScript, Tailwind CSS, OpenAI API, Next-Auth, and Prisma. The application allows users to chat with a bot that suggests hobbies based on the user's interests. The database is hosted using Supabase, and the application is hosted on Vercel.


1. Clone the repository using the following command:

```bash
git clone https://github.com/<username>/hobby-bot.git
```


2. Install the dependencies using npm or yarn:

```bash
npm install
or
yarn
```


3. Create a `.env.local` file and add the following environment variables:

```bash
OPENAPI_KEY=<your OpenAI API key>
GOOGLE_CLIENT_ID=<your Google Client Id>
GOOGLE_CLIENT_SECRET=<your Google Client Secret>
DATABASE_URL=<your Supabase database URL>
NEXTAUTH_SECRET=<a secret>

```


You can get your OpenAI API key from the [OpenAI website](https://beta.openai.com/docs/api-reference/authentication). To get your Supabase database URL and anonymous key, follow the instructions on the [Supabase website](https://supabase.io/docs/guides/with-nextjs).

4. Run the following command to start the application:

```bash
npm run dev
or
yarn run dev
```


The application will be available at `http://localhost:3000`.

## Usage

To use the application, open it in a web browser at https://hoby-bot.vercel.app. You will be prompted to log in with your email address or a social media account using Next-Auth. Once logged in, you can chat with the bot by typing your interests into the chat window. The bot will suggest hobbies based on your interests using the OpenAI API.

## Deployment

To deploy the application to Vercel, follow these steps:

1. Create a new project on Vercel.

2. Link your GitHub repository to the Vercel project.

3. Set the following environment variables in the Vercel project:

```bash
OPENAPI_KEY=<your OpenAI API key>
GOOGLE_CLIENT_ID=<your Google Client Id>
GOOGLE_CLIENT_SECRET=<your Google Client Secret>
DATABASE_URL=<your Supabase database URL>
NEXTAUTH_SECRET=<a secret>
```


4. Configure the project settings and deploy the application.

The application will be available at `https://<YOUR-PROJECT>.vercel.app`.

## Contributing

To contribute to the project, follow these steps:

1. Fork the repository.

2. Clone your fork of the repository.

3. Create a new branch to work on.

4. Make your changes and commit them.

5. Push your changes to your fork of the repository.

6. Create a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

