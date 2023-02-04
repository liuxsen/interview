import serve from 'rollup-plugin-serve'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'esm'
  },
  watch: {
    include: 'src/**'
  },
  // plugins: [
  //   serve({
  //     port: 8089,
  //     contentBase: ['']
  //   })
  // ]
}