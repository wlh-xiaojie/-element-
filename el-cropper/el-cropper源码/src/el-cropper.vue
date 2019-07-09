<template>
 <el-dialog :title="options.title" :visible.sync="dialogVisible" :before-close="handleClose">
  <div class="el-cropper">
    <div>
      <div class="cropper-content">
        <div class="cropper">
          <vueCropper ref="cropper"
                    :img="options.img"
                    :outputSize="options.size"
                    :outputType="options.outputType"
                    :info="true"
                    :full="options.full"
                    :canMove="options.canMove"
                    :canMoveBox="options.canMoveBox"
                    :original="options.original"
                    :autoCrop="options.autoCrop"
                    :autoCropWidth="options.autoCropWidth"
                    :autoCropHeight="options.autoCropHeight"
                    :fixedBox="options.fixedBox"
                    :enlarge="options.enlarge"
                    :centerBox="options.centerBox"
                    :fixedNumber="options.fixedNumber"
                    :fixed="options.fixed"
                    :maxImgSize="options.maxImgSize"
                    @realTime="realTime"
                    ></vueCropper>
        </div>
        <div class="show-preview" :style="{'overflow': 'hidden'}">
          <div class="wait">预览区域：</div>
            <div class="preview">
                <img :src="imgsrc" alt="" :style="scaleFun">
            </div>
            <div class="detailsclass">
              <p class="">截图详情：</p>
              <p v-text="options.details" :title="options.details"></p>
            </div>
          </div>
        </div>
      </div>
  
    <div>
      <div class="footer-btn">
        <div class="scope-btn">
          <!-- 选择图片 -->
          <div class="scope-change">
            <label class="btn" for="uploads">选择图片</label>
            <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/jpg" @change="uploadImg($event, 1)">
          </div>
          <!-- 功能按钮 -->
          <div class="scoper-fun">
            <Button type="ghost" @click="changeScale(1)" icon="plus-round" class="l-btn">+</Button>
            <Button type="ghost" @click="changeScale(-1)" icon="minus-round" class="l-btn">-</Button>
            <Button type="ghost" @click="rotateLeft" class="l-btn"><span style="font-weight: 600;">↺</span></Button>
            <Button type="ghost" @click="rotateRight" class="l-btn"><span style="font-weight: 600;">↻</span></Button>
          </div>

        </div>
        <!-- true false -->
        <div class="upload-btn">
          <button @click="onclose()" class="btn">取 消</button>
          <button @click="oncropped('base64')" class="btn">确 定</button>
        </div>
      </div>
    </div>
    
  </div>
  </el-dialog>
</template>

<script>
// 引入ElDialog and VueCropper 组件
import ElDialog from '../../dialog/src/component';
import {VueCropper} from 'vue-cropper';
export default {
  name: 'ElCropper',
  // 接收的数据 带默认值
  props: {
    img: {
      type: String,
      required: true,
      default: ''
    },
    title: {
      type: String,
      default: '图像裁剪'
    },
    details: {
      type: String,
      default: '图片尽量不超过3M，可自选，尽量以裁剪高清图片，图片剪切限制为jpg，jpeg， png格式,请不要随意剪切上传，影响您的图片质量!!!'
    },
    fixed: {
      type: Boolean,
      default: false
    },
    fixednumber: {
      type: Array,
      default: () => []
    },
    outputtype: {
      type: String,
      default: ' png | jpeg | jpg'
    },
    autocropwidth: {
      type: Number,
      default: 200
    },
    autocropheight: {
      type: Number,
      default: 200
    },
    maxImgsize: {
      type: Number,
      default: 2000
    },
    size: {
      type: Number,
      default: 1
    },
    canmove: {
      type: Boolean,
      default: true
    },
    canmovebox: {
      type: Boolean,
      default: true
    },
    centerbox: {
      type: Boolean,
      default: false
    },
    fixedbox: {
      type: Boolean,
      default: false
    },
    autocrop: {
      type: Boolean,
      default: true
    },
    full: {
      type: Boolean,
      default: false
    },
    original: {
      type: Boolean,
      default: false
    },
    enlarge: {
      type: Number,
      default: 1
    }
  },
  // data
  data() {
    return {
      options: {
        img: this.img,
        outputSize: this.size,
        outputType: this.outputtype,
        full: this.full,
        canMove: this.canmove,
        canMoveBox: this.canmovebox,
        original: this.original,
        autoCrop: this.autocrop,
        autoCropWidth: this.autocropwidth,
        autoCropHeight: this.autocropheight,
        fixedBox: this.fixedbox,
        enlarge: this.enlarge,
        centerBox: this.centerbox,
        fixed: this.fixed,
        fixedNumber: this.fixednumber,
        maxImgSize: this.maximgsize,
        title: this.title,
        details: this.details
      },
      // crap: false,
      previews: {},
      previewsw: 200,
      previewsh: 200,
      imgsrc: '',
      scaleratioXY: 1,
      dialogVisible: true
    };
  },
  // 监听传入参数是否发生改变
  watch: {
    fixednumber: {
      // 深度监听，if 传入比例则开启固定裁剪框比例，true    else  false
      handler(newName, oldName) {
        console.log(newName);
        // this.options.title = newName;
        if (newName.length !== 0) {
          this.options.fixed = true;
        } else {
          this.options.fixed = false;
        }
        console.log(oldName);
      },
      deep: true,
      immediate: true
    }
  },
  // 预览实时缩放
  computed: {
    scaleFun: function() {
      var scale = this.scaleratioXY;
      return `transform:scale(${scale},${scale})`;
    }
  },
  // 方法区
  methods: {
    // el-dialog 弹窗功能
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
          this.onclose();
        })
        .catch(_ => {});
    },
    // 图片缩放
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    // 左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    // 右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    // 预览
    realTime(data) {
      var that = this;
      var dataoption = data;
      this.$refs.cropper.getCropData(data => {
        that.imgsrc = data;
        if (dataoption.w >= 200 || dataoption.h >= 200) {
          if (dataoption.w >= dataoption.h) {
            that.scaleratioXY = 200 / dataoption.w;
          }
          if (dataoption.h > dataoption.w) {
            that.scaleratioXY = 200 / dataoption.h;
          }
        }
      });
    },
    imgLoad(msg) {
      console.log(msg);
    },
    // 上传
    uploadImg(e, num) {
      // 上传图片
      // this.option.img
      var that = this;
      var file = e.target.files[0];
      if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
        alert('图片类型必须是.gif,jpeg,jpg,png中的一种');
        return false;
      }
      var reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        if (num === 1) {
          that.options.img = data;
          // var dat = {img: data};
          // that.$emit('updateimg', dat);
        } else if (num === 2) {
          this.example2.img = data;
        }
      };
      // 转化为base64
      reader.readAsDataURL(file);
      // 转化为blob
      // reader.readAsArrayBuffer(file)
    },
    // 裁剪
    oncropped(type) {
      var that = this;
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob(data => {
          // var img = window.URL.createObjectURL(data);
        });
      } else {
        this.$refs.cropper.getCropData(data => {
          var dats = {img: data};
          that.$emit('getcropperimg', dats);
          if (this.options.img === '') {
            alert('您还没有选择图片');
          } else {
            this.onclose();
          }
        });
      }
    },
    // 关闭
    onclose() {
      this.$emit('closecropper');
    }
  },
  // 注册组件
  components: {
    VueCropper,
    ElDialog
  }
};
 </script>
