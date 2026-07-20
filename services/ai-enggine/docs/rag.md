# RAG

RAG code lives in `services/ai-enggine/app/rag`.

## Responsibilities

- Load source documents.
- Extract text.
- Split content into chunks.
- Generate embeddings.
- Store and query local FAISS indexes.
- Retrieve knowledge scoped by `business_id`.

## Boundary

`services/ai-enggine` may manage local FAISS files, but PostgreSQL metadata remains owned by `services/api`.

## Rules

- Every index and query must be namespace-filtered by `business_id`.
- Do not read or write PostgreSQL directly.
- Document and chunk metadata updates must go through `services/api`.
- Keep storage under `services/ai-enggine/app/storage`.

## TODO

- Replace placeholder loader, extractor, splitter, embedding, vectorstore, indexer, and retriever modules in a dedicated RAG implementation task.
