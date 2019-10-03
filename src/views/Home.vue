<template>
    <my-page title="像素图制作" :page="page">
        <div class="common-container container">
            <ui-row gutter>
                <ui-col width="100" tablet="100" desktop="50">
                    <div class="btns">
                        <ui-raised-button class="btn" label="下载" primary @click="download" />
                        <ui-raised-button class="btn" label="填充" @click="fill" />
                        <ui-raised-button class="btn" label="上传" @click="save" v-if="saveVisible" />
                    </div>
                    <input class="input" v-model="curColor" type="color">
                    <ul class="color-list">
                        <!-- <li class="item item-current"
                            :style="{'background-color': curColor}"
                            @click="selectColor(curColor)"></li> -->
                        <li class="item"
                            :style="{'background-color': color}"
                            @click="selectColor(color)"
                            v-for="color in colors"></li>
                    </ul>
                </ui-col>
                <ui-col width="100" tablet="100" desktop="50">
                    <div v-if="edit">
                        <input v-model="x">
                        <input v-model="y">
                    </div>
                    <canvas id="canvas" width="448" height="448"
                        @mousedown="onMouseDown($event)"
                        @mousemove="onMouseMove($event)"
                        @mouseup="onMouseUp($event)"
                        @mouseout="onMouseOut($event)"
                        @touchstart="onTouchStart($event)"
                        @touchmove="onTouchMove($event)"
                        @touchend="onTouchEnd($event)"
                        >
                    </canvas>
                    <!-- <ui-color-picker v-model="curColor" ></ui-color-picker> -->
                </ui-col>
            </ui-row>
        </div>
        <ui-drawer class="settingBox" :open="settingVisible" :docked="false" right @close="toggleSetting()">
            <ui-appbar title="设置">
                <ui-icon-button icon="close" slot="left" @click="toggleSetting" />
                <ui-icon-button icon="check" slot="right" @click="finish" />
            </ui-appbar>
            <div class="body">
                <!-- 设置内容 -->
                <ui-text-field v-model.number="gridNum" type="number" label="格子数量" />
            </div>
        </ui-drawer>
    </my-page>
</template>

<script>
    /* eslint-disable */
    const saveAs = window.saveAs

    export default {
        data () {
            return {
                colors: ['#000000', '#ffffff', '#ff0000', '#0099cc'],
                curGrid: null,
                curColor: '#000000',
                settingVisible: false,
                gridNum: 8,
                gridSize: 14,
                map: [],
                saveVisible: false,
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'settings',
                            click: this.toggleSetting,
                        },
                        {
                            type: 'icon',
                            icon: 'apps',
                            href: 'https://app.yunser.com?utm_source=pixel',
                            target: '_blank',
                            title: '应用'
                        }
                    ]
                },
                edit: false,
                x: 0,
                y: 0
            }
        },
        mounted() {
            this.saveVisible = !!this.$route.query.debug
            this.canvas = document.getElementById('canvas')
            let size = window.innerWidth - 32
            if (size > 480) {
                size = 480
            }
            this.size = size
            this.canvas.style.width = size + 'px'
            this.canvas.style.height = size + 'px'
            this.ctx = this.canvas.getContext('2d')
            this.ctx.width = 448
            this.ctx.height = 448

            this.initData()

            // this.map[2][3] = '#09c'
            // this.map[4][4] = 'f00'


            // this.ctx.fillRect(0, 0, 100, 100)
            this.timer = setInterval(this.update, 100)
        },
        destroyed() {
            clearInterval(this.timer)
        },
        methods: {
            initData() {
                this.gridSize = 448 / this.gridNum
                this.map = []

                console.log(this.$route.params)
                if (this.$route.query.edit) {
                    this.edit = true
                    this.x = this.$route.query.x
                    this.y = this.$route.query.y
                }
                for (let row = 0; row < this.gridNum; row++) {
                    let rowData = []
                    for (let column = 0; column < this.gridNum; column++) {
                        // rowData.push(null)
                        rowData.push('#fff')
                    }
                    this.map.push(rowData)
                }
            },
            toggleSetting() {
                this.settingVisible = !this.settingVisible
            },
            finish() {
                this.settingVisible = false
                if (!this.gridNum) {
                    this.$message({
                        type: 'danger',
                        text: '请输入格子数量'
                    })
                    return
                }
                if (this.gridNum < 1) {
                    this.$message({
                        type: 'danger',
                        text: '格子数量至少为 2'
                    })
                    return
                }
                this.initData()
            },
            update() {
                this.ctx.clearRect(0, 0, 448, 448)
                this.ctx.strokeStyle = '#666'
                // for (let i = 0; i < 15; i++) {
                //     this.ctx.beginPath()
                //     this.ctx.moveTo(0, (i + 1) * grid)
                //     this.ctx.lineTo(448, (i + 1) * grid)
                //     this.ctx.stroke()
                // }
                // for (let i = 0; i < 15; i++) {
                //     this.ctx.beginPath()
                //     this.ctx.moveTo((i + 1) * grid, 0)
                //     this.ctx.lineTo((i + 1) * grid, 448)
                //     this.ctx.stroke()
                // }

                for (let row = 0; row < this.gridNum; row++) {
                    for (let column = 0; column < this.gridNum; column++) {
                        if (this.map[row][column]) {
                            this.ctx.fillStyle = this.map[row][column]
                            this.ctx.fillRect(row * this.gridSize, column * this.gridSize, this.gridSize, this.gridSize)
                        }
                    }
                }
                if (this.curGrid) {
                    this.ctx.fillStyle = this.curColor
                    this.ctx.fillRect(this.curGrid.x * this.gridSize, this.curGrid.y * this.gridSize, this.gridSize, this.gridSize)
                }
            },
            onMouseDown(e) {
                if (e.button === 2) {
                    return
                }
                this._start(e)
            },
            onTouchStart(e) {
                console.log('start', e)
                this._start(e.touches[0])
            },
            _start(pt) {
                let rect = this.canvas.getBoundingClientRect()
                let x = parseInt(((pt.pageX - rect.x) / this.size * 448) / this.gridSize)
                let y = parseInt(((pt.pageY - rect.y) / this.size * 448) / this.gridSize)


                this.map[x][y] = this.curColor
                this.isDown = true
                this.addColor(this.curColor)
            },
            onMouseMove(e) {
                this._move(e)
            },
            onTouchMove(e) {
                this._move(e.touches[0])
            },
            _move(pt) {
                let rect = this.canvas.getBoundingClientRect()
                let x = parseInt(((pt.pageX - rect.x) / this.size * 448) / this.gridSize)
                let y = parseInt(((pt.pageY - rect.y) / this.size * 448) / this.gridSize)
                this.curGrid = {
                    x: x,
                    y: y
                }
                if (this.isDown) {
                    this.map[x][y] = this.curColor
                }
            },
            onMouseUp(e) {
                // let rect = this.canvas.getBoundingClientRect()
                // let x = parseInt((e.pageX - rect.x) / grid)
                // let y = parseInt((e.pageY - rect.y) / grid)
                this._up()
            },
            onTouchEnd(e) {
                this._up()
            },
            _up() {
                this.isDown = false
            },
            onMouseOut(e) {
                this.curGrid = null
            },
            download() {
                this.canvas.toBlob(blob => {
                    let fileName = '云设像素图制作.png'
                    if (this.edit) {
                        fileName = `0,${this.x},${this.y}.png`
                    }
                    saveAs(blob, fileName)
                })
            },
            save() {
                let dataUrl = this.canvas.toDataURL()
                console.log(dataUrl)
                let data = {
                    width: this.gridNum,
                    height: this.gridNum,
                    img: dataUrl,
                    data: this.map,
                }
                console.log('data', data)
                this.$http.post('/pixels', data).then(
                    response => {
                        let data = response.data
                        // if (data.code === 200) {
                        //     console.log(data)
                        //     this.version = data.data
                        // }
                    },
                    response => {
                        console.log(response)
                    })
            },
            selectColor(color) {
                this.curColor = color
            },
            fill() {
                for (let row = 0; row < this.gridNum; row++) {
                    for (let column = 0; column < this.gridNum; column++) {
                        // rowData.push(null)
                        this.map[row][column] = this.curColor
                    }
                }
            },
            addColor(color) {
                if (!this.colors.includes(color)) {
                    this.colors.unshift(color)
                    this.colors = this.colors.splice(0, 8)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.settingBox {
    width: 100%;
    max-width: 320px;
    .body {
        padding: 16px;
    }
}
canvas {
    margin-bottom: 16px;
    background-color: #fff;
    border: 1px solid #eee;
}
.input {
    margin-bottom: 16px;
}
.color-list {
    margin-bottom: 16px;
    overflow: hidden;
    .item {
        float: left;
        width: 48px;
        height: 48px;
        margin-right: 8px;
        border: 1px solid #eee;
        border-radius: 50%;
        cursor: pointer;
    }
    .item-current {
        margin-right: 24px;
        border-color: #000;
        cursor: default;
    }
}
.btns {
    margin-bottom: 16px;
    .btn {
        margin-right: 8px;
    }
}
</style>
