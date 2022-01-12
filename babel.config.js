module.exports = {
    presets: ['@vue/cli-plugin-babel/preset'],
    plugins: [
        [
            'import',
            {
                libraryName: 'vant',
                libraryDirectory: 'es',
                style: (name) => `${name}/style/less`
            }
        ]
    ],
    ignore: ['./src/components/streamPlayer/js/hrtc.js']
}
