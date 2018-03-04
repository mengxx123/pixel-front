<template>
    <my-page title="World">
        <div>像素图制作 v1.0.0</div>
        <div class="rows" v-for="y in 8">
            <div class="row" v-for="x in 20" title="点击编辑">
                <img class="tile" :src="'http://img1.yunser.com' + `/tile/0,${x - 1},${y - 1}.png`" @click="edit(x - 1, y - 1)">
            </div>
        </div>
    </my-page>
</template>

<script>
    export default {
        data () {
            return {
                version: ''
            }
        },
        mounted() {
            this.$http.get('/version').then(
                response => {
                    let data = response.data
                    if (data.code === 200) {
                        console.log(data)
                        this.version = data.data
                    }
                },
                response => {
                    console.log(response)
                })
        },
        methods: {
            edit(x, y) {
                this.$router.push(`/?edit=true&x=${x}&y=${y}`)
            }
        }
    }
</script>

<style scoped>
.rows {
    display: flex;
    flex-wrap: nowrap;
}
.row {
    float: left;
}
.tile {
    width: 100px;
    height: 100px;
}
</style>
