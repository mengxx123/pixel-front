<template>
    <my-page title="作品展示" :page="page">
        <div class="common-container container">
            <div class="empty" v-if="!pixels.length">没有作品</div>
            <ul class="pixel-list">
                <li class="item" v-for="item in pixels">
                    <img class="img" :src="item.img">
                </li>
            </ul>
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    export default {
        data () {
            return {
                pixels: [],
                page: {
                    menu: [
                        // {
                        //     type: 'icon',
                        //     icon: 'settings',
                        //     click: this.toggleSetting,
                        // },
                        // {
                        //     type: 'icon',
                        //     icon: 'apps',
                        //     href: 'https://app.yunser.com?utm_source=pixel',
                        //     target: '_blank',
                        //     title: '应用'
                        // }
                    ]
                },
            }
        },
        mounted() {
            this.loadData()
        },
        destroyed() {
        },
        methods: {
            loadData() {
                this.$http.get('/pixels').then(
                    response => {
                        let data = response.data
                        this.pixels = data
                        // if (data.code === 200) {
                        //     console.log(data)
                        //     this.version = data.data
                        // }
                    },
                    response => {
                        console.log(response)
                    })
            }
        }
    }
</script>

<style lang="scss" scoped>
.empty {
    text-align: center;
    padding: 80px 0;
    color: #999;
}
.pixel-list {
    display: flex;
    flex-wrap: wrap;
    .item {
        margin-right: 16px;
        margin-bottom: 16px;
    }
    .img {
        max-width: 80px;
        max-height: 80px;
        border: 1px solid rgba(0, 0, 0, .12);
    }
}
</style>
