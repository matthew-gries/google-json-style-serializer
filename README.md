# Google JSON Style Serializer

Serializer for JSON objects using Google's JSON style guide, with a focus on user simplicity.

## Usage

### Serializing Data

```typescript
import GoogleJSONSeralizer from "google-json-style-serializer";

const serializer = new GoogleJSONSerializer.DataSerializer(opts);
const serializedData = serializer.serialize(dataToSerialize);
```

`opts` is an object with the properties:  
 * `topLevel` - options relating to the top level properties of the serialized JSON object. These options are described [here](https://google.github.io/styleguide/jsoncstyleguide.xml#Top-Level_Reserved_Property_Names)  
 * `data` - options relating specifically to the JSON data. These options are described [here](https://google.github.io/styleguide/jsoncstyleguide.xml#Reserved_Property_Names_in_the_data_object), as well as [here for paging](https://google.github.io/styleguide/jsoncstyleguide.xml#Reserved_Property_Names_for_Paging) and [here for links](https://google.github.io/styleguide/jsoncstyleguide.xml#Reserved_Property_Names_for_Links)

`dataToSerialize` can be any object or array of objects. If `dataToSerialize` is an array, the data is serialized under `data.items` of the serialized data. If `dataToSerialize` is an object, then it's fields are added directly to the `data` feld of the serialized data object.

### Serializing Errors

```typescript
import GoogleJSONSeralizer from "google-json-style-serializer";

const serializer = new GoogleJSONSerializer.ErrorSerializer(opts);
const serializedData = serializer.serialize(errorsToSerialize);
```

`opts` is an object with the properties:  
 * `topLevel` - options relating to the top level properties of the serialized JSON object. These options are described [here](https://google.github.io/styleguide/jsoncstyleguide.xml#Top-Level_Reserved_Property_Names)  
 * `error` - options relating specifically to the serialized errors. These options are described [here](https://google.github.io/styleguide/jsoncstyleguide.xml#Reserved_Property_Names_in_the_error_object)

`errorsToSerialize` can be an `Error` or an array of `Error` (or any subclass of `Error`). If `errorsToSerialize` is an array, the errors are serialized under the `error.errors` field of the serialized object, where each entry has a `message` and `reason` field. If `errorsToSerialize` is an `Error` object, only the message is given under `error.message`.

If `error.errors` is given under `opts`, the fields of `error.errors` are mapped to each error given in `errorsToSerialize` (if `errorsToSerialize` is an `Error`, then it is just mapped to the first element of `error.errors`.) If these arrays are not the same in length, an exception is thrown.
