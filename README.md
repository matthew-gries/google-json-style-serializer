# Google JSON Style Serializer

Serializer for JSON objects using Google's JSON style guide, with a focus on user simplicity.

## Usage

For serializing data:

```typescript
import JSONSerializer from "google-json-style-serializer";

const serializer = new JSONSerializer(opts);
const serializedData = serializer.serialize(data);
```
