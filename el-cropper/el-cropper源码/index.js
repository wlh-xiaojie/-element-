import Testvue from './src/el-cropper';

/* istanbul ignore next */Testvue.install = function(Vue) {
  Vue.component(Testvue.name, Testvue);
};

export default Testvue;
