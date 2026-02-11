declare module '*.JPG' {
  const content: import('next/image').StaticImageData
  export default content
}

declare module '*.jpeg' {
  const content: import('next/image').StaticImageData
  export default content
}
