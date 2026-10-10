

## How it works

1. **Observe**: take or choose a photo, add a few words, answer up to three plain-language questions ("Not sure" is a valid answer).
2. **Analyze**: the app sends the photo and answers to Gemma 4 running in Ollama on your own machine. Nothing is sent to a cloud service.
3. **Read the result**: candidates, a qualitative likelihood (never "certain"), what the model could actually see, and what extra detail would make it surer.
4. **Go and look**: saving takes you to a full-screen, navigation-free page with one quest and a timer that keeps running with the screen locked. Afterwards you can add a one-line note to the journal entry.

## Model

| | |
|---|---|
| Model | Gemma 4 **E4B**, instruction-tuned (`gemma4:e4b`) |
| Why | Accepts images, is Ollama's default Gemma 4 tag, and fits a typical laptop |
| Context | 128K tokens |
| License | Apache 2.0 |
| Alternatives | `gemma4:e2b` (lighter, weaker vision), `gemma4:26b` (stronger vision, needs roughly 20+ GB memory) |

Set the model with `VITE_GEMMA_MODEL`. Memory guidance (verify on your machine with `ollama ps`): about 10 GB of VRAM or 16 GB of unified memory for E4B. The first request is slow because the model loads.

## Run it

```bash
# 1. Install Ollama (https://ollama.com), version 0.20.0 or newer, then:
ollama pull gemma4:e4b
ollama serve            # skip if the Ollama app is already running

# 2. Install and check the model, including image input
npm install
npm run check:gemma path/to/any-photo.jpg

# 3. Start the app (Vite proxies /ollama to localhost:11434, so no CORS setup is needed)
cp .env.example .env   # Windows: copy .env.example .env
npm run dev
```

Other commands: `npm test` (guardrail unit tests), `npm run dev:mock` (sample data, for UI work only; works on Windows too), `npm run build`.
To use it on a phone, open the dev server's network URL from the same Wi-Fi. Ollama stays on the computer.

### Offline behavior
The journal and quests are stored on the device and work with no connection once the app has loaded once. AI analysis needs Ollama reachable, which for a laptop-hosted setup means the same machine or network, but not the internet. The service worker deliberately never caches Ollama requests, so the app cannot pretend the model is available when it is not.

## How uncertainty is handled

The prompt asks Gemma to hedge, but the code does not trust the prompt. `src/services/ai/schema.js` enforces, after the model replies:

- Output must match a JSON schema, or the result is rejected and the user can retry.
- Likelihoods are three bands (`unlikely`, `possible`, `probable`). There is no "certain" band, and sentences with phrases like "definitely" are removed.
- `probable` requires a photo, at least three visible features, and no equally-probable rival.
- With no photo, nothing may exceed `possible`. If the photo is judged unusable, every candidate drops to `unlikely` and no name is shown.
- A species name is only shown with at least two visible features listed.
- The number behind each band is not shown, because a small model's self-estimate is not a calibrated probability.
- Plants and fungi carry a standing "never eat or handle based on this result" notice.

These rules are covered by `tests/guardrails.test.mjs`.

## Limitations

- **Gemma 4 E4B is a general vision-language model, not a species classifier.** Google publishes general benchmarks, not fine-grained species accuracy. Expect reasonable group-level answers and weaker species-level ones, especially for look-alikes, juveniles and poor photos.
- Models can state wrong facts confidently; the "facts" and "habitat" text should be checked against a field guide.
- Photos are stored as 640 px JPEG thumbnails in `localStorage`, which has a size limit (roughly 5 MB). Moving to IndexedDB is a known TODO.
- No regional filtering: the model does not know your location, so local species may be missed.
- Local inference speed depends on hardware; CPU-only machines can take a minute or more.

## Why open weights fit this app

- **Privacy:** photos of your garden, home or children's hands stay on your machine.
- **Works where there is no signal:** trails rarely have coverage, and a local model does not need any.
- **No per-request cost or account:** run it as often as you like.
- **Swappable:** changing the model is one environment variable, and the same code can later point at a fine-tuned species model.
- **Auditable:** the weights are Apache 2.0, so behavior can be inspected and the demo can be reproduced by anyone.

## Real-world test

_Fill this in after going outside: what you photographed, what Gemma answered, what it got wrong, how long it took on your hardware, and which model/hardware you used._

## Post-deadline changes

None yet.
