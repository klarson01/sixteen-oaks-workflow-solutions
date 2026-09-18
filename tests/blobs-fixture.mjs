const stores = new Map();
let version = 0;
export function getStore({ name }) {
  if (!stores.has(name)) stores.set(name, new Map());
  const records = stores.get(name);
  return {
    async get(key) {
      return structuredClone(records.get(key)?.data ?? null);
    },
    async getWithMetadata(key) {
      return structuredClone(records.get(key) ?? null);
    },
    async getMetadata(key) {
      const value = records.get(key);
      return value
        ? structuredClone({ etag: value.etag, metadata: value.metadata })
        : null;
    },
    async setJSON(key, data, options = {}) {
      if (
        (options.onlyIfNew && records.has(key)) ||
        (options.onlyIfMatch && records.get(key)?.etag !== options.onlyIfMatch)
      )
        return { modified: false };
      const etag = String(++version);
      records.set(key, { data: structuredClone(data), etag, metadata: {} });
      return { modified: true, etag };
    },
    async set(key, data, options = {}) {
      if (
        (options.onlyIfNew && records.has(key)) ||
        (options.onlyIfMatch && records.get(key)?.etag !== options.onlyIfMatch)
      )
        return { modified: false };
      const etag = String(++version);
      records.set(key, { data, metadata: options.metadata, etag });
      return { modified: true, etag };
    },
    async delete(key) {
      records.delete(key);
    },
    async list({ prefix }) {
      return {
        blobs: [...records.keys()]
          .filter((key) => key.startsWith(prefix))
          .map((key) => ({ key, etag: records.get(key).etag })),
      };
    },
  };
}
