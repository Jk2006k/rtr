export const tagReplacements = {
  div: 'View',
  span: 'Text',
  p: 'Text',
  h1: 'Text',
  h2: 'Text',
  h3: 'Text',
  h4: 'Text',
  h5: 'Text',
  h6: 'Text',
  img: 'Image',
  button: 'TouchableOpacity',
  input: 'TextInput',
  form: 'View',
  label: 'Text',
}

export const importReplacements = {
  "react-dom": "react-native",
  "react-dom/client": "react-native",
  "react-router-dom": "react-navigation",
  "styled-components": "react-native",
}

export const styleReplacements = {
  "className": "style",
  "style={{": "style={{",
}

export const fileExtensions = [".js", ".jsx", ".ts", ".tsx"]

export const unsupportedHTMLTags = [
  "video", "audio", "iframe", "canvas", "svg"
]
