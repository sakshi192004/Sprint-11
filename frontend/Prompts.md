# AI Pair-Programming Log — Cine-Stream

This file records AI-assisted learning/debugging sessions for Sprint 08.

## Session 1 — Architecture

**Prompt:**  
Explain how to structure a React SPA that consumes the TMDB API, supports search, infinite scroll, favorites, and lazy-loaded images.

**What I learned:**  
- Keep API functions separate from UI components.
- Keep movie rendering inside a reusable card component.
- Use a page counter for infinite scrolling.
- Store favorites separately from fetched movie results.

## Session 2 — Debouncing

**Prompt:**  
Explain a 500ms debounce utility in React without firing a request on every keystroke.

**What I learned:**  
The input state can update immediately, while a second debounced state updates only after the user stops typing for the configured delay. The API effect depends on the debounced value.

## Session 3 — Infinite Scroll

**Prompt:**  
Explain IntersectionObserver for infinite scrolling in beginner-friendly terms.

**What I learned:**  
An invisible sentinel is placed after the movie grid. When it enters the viewport, the next page is fetched. The previous array is preserved with `previous => [...previous, ...newResults]`.

## Session 4 — Favorites

**Prompt:**  
Explain how to persist a React array in localStorage.

**What I learned:**  
Read the saved JSON when state initializes, then serialize the latest array with `JSON.stringify` whenever the favorites state changes.

## Session 5 — API Security

**Prompt:**  
Why should an LLM API key not be placed directly in a Vite React client?

**What I learned:**  
Vite environment variables prefixed with `VITE_` are exposed to browser code. A secret LLM key therefore needs a server/serverless boundary.

## My own implementation notes

I used the explanations above as a learning reference and implemented the project structure myself. Before committing, I should be able to explain:
- every state variable,
- every `useEffect`,
- the debounce cleanup,
- the IntersectionObserver cleanup,
- the TMDB request parameters,
- the localStorage synchronization,
- and why client-side public TMDB configuration differs from a private LLM secret.
