import { useSignal } from "@preact/signals";

import { encode } from "../util/Encoder.ts";

export default function Counter() {
  const output = useSignal(" ");

  return (
    <div class="flex flex-col gap-8 py-6 items-center justify-center">
      <div
        contenteditable
        class="border-0 border-b-4 border-zinc-200 focus:border-blue-400 outline-none bg-transparent text-3xl w-32 min-w-max inline-block capitalize"
        onInput={(ev) => {
          const input = ev.currentTarget.textContent;
          if (input !== null) {
            output.value = encode(input);
          }
        }}
      />

      <div class="border-1 border-zinc-200 outline-none bg-transparent text-3xl w-32 min-w-max inline-block capitalize">
        {output}
      </div>
    </div>
  );
}
