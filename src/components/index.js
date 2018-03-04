import page from './page'
import colorPicker from './color-picker'

export default {
    install: function (Vue) {
        Vue.component('ui-color-picker', colorPicker)
        Vue.component('my-page', page)
    }
}
