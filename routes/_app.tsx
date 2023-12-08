import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Interactive Iovah Encoder</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="bg-neutral-900 text-zinc-200">
        <Component />
      </body>
    </html>
  );
}
