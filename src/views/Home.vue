<template>
    <my-page title="像素图制作" :page="page">
        <ui-row gutter>
            <ui-col width="100" tablet="100" desktop="50">
                <div class="btns">
                    <ui-raised-button class="btn" label="下载" primary @click="download" />
                    <ui-raised-button class="btn" label="填充" @click="fill" />
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
                    >
                </canvas>
                <!-- <ui-color-picker v-model="curColor" ></ui-color-picker> -->
            </ui-col>
        </ui-row>
        
    </my-page>
</template>

<script>
    const saveAs = window.saveAs
    // let grid = 28
    // let SIZE = 16
    let grid = 14
    let SIZE = 32

    export default {
        data () {
            return {
                colors: ['#000000', '#ffffff', '#ff0000', '#0099cc'],
                curGrid: null,
                curColor: '#000000',
                map: [],
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'help',
                            to: '/help'
                        }
                    ]
                },
                edit: false,
                x: 0,
                y: 0
            }
        },
        mounted() {
            console.log(this.$route.params)
            if (this.$route.query.edit) {
                this.edit = true
                this.x = this.$route.query.x
                this.y = this.$route.query.y
            }
            for (let row = 0; row < SIZE; row++) {
                let rowData = []
                for (let column = 0; column < SIZE; column++) {
                    // rowData.push(null)
                    rowData.push('#fff')
                }
                this.map.push(rowData)
            }
            // this.map[2][3] = '#09c'
            // this.map[4][4] = 'f00'

            this.canvas = document.getElementById('canvas')
            this.canvas.style.width = '448px'
            this.canvas.style.height = '448px'
            this.ctx = this.canvas.getContext('2d')
            this.ctx.width = 448
            this.ctx.height = 448
            // this.ctx.fillRect(0, 0, 100, 100)
            this.timer = setInterval(this.update, 100)
        },
        destroyed() {
            clearInterval(this.timer)
        },
        methods: {
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

                for (let row = 0; row < SIZE; row++) {
                    for (let column = 0; column < SIZE; column++) {
                        if (this.map[row][column]) {
                            this.ctx.fillStyle = this.map[row][column]
                            this.ctx.fillRect(row * grid, column * grid, grid, grid)
                        }
                    }
                }
                if (this.curGrid) {
                    this.ctx.fillStyle = this.curColor
                    this.ctx.fillRect(this.curGrid.x * grid, this.curGrid.y * grid, grid, grid)
                }
            },
            onMouseDown(e) {
                if (e.button === 2) {
                    return
                }
                let rect = this.canvas.getBoundingClientRect()
                let x = parseInt((e.pageX - rect.x) / grid)
                let y = parseInt((e.pageY - rect.y) / grid)
                this.map[x][y] = this.curColor
                this.isDown = true
                this.addColor(this.curColor)
            },
            onMouseMove(e) {
                let rect = this.canvas.getBoundingClientRect()
                let x = parseInt((e.pageX - rect.x) / grid)
                let y = parseInt((e.pageY - rect.y) / grid)
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
            selectColor(color) {
                this.curColor = color
            },
            fill() {
                for (let row = 0; row < SIZE; row++) {
                    for (let column = 0; column < SIZE; column++) {
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
