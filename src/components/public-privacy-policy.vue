<template>
  <div v-if="open" class="popup-mask" @click="close">
    <div class="popup-box" @click.stop>
      <div class="popup-header">
        <span class="popup-title">《隐私协议》</span>
        <span class="popup-close" @click="close">×</span>
      </div>
      <div class="popup-body">
        <div class="popup-content-line">尊敬的客户：</div>
        <div class="popup-content-line">
          根据《中华人民共和国反恐怖主义法》、《全国人民代表大会常务委员会关于加强网络信息保护的决定》、《电信和互联网用户个人信息保护规定》（工业和信息化部令第24号）和《电话用户真实身份信息登记规定》（工业和信息化部令第25号）等国家法律法规的要求，客户在运营商各类营业网点（含自有营业厅、手机营业厅、网上营业厅、授权合作代理商等）办理固定电话、移动电话（含无线上网卡）入网、过户以及需要出示客户证件的有关业务时，客户应配合出示有效证件原件并进行查验、登记，登记信息包括姓名、证件类型、号码及地址等。同时，为更好地提供服务，需要客户提供如联系人、联系电话、通信地址、电子邮箱等信息。客户本人持有效证件可通过自有营业厅查询和/或更正本人信息，或登录手机营业厅查询本人信息。
        </div>
        <div class="popup-content-line">
          如客户拒绝依法提供个人有效证件及真实信息，我公司有权不提供服务或终止服务。
        </div>
        <div class="popup-content-line">
          为向客户提供优质、个性化的服务，包括但不限于提供通信服务、保障通信服务安全、改善服务质量、推介个性化产品等，我公司将遵循合法、正当、必要的原则，按照法律法规规定和/或协议约定使用留存客户个人信息，并妥善保管，严格保密，依法保护客户个人信息，非因下列事由，不对外泄露客户个人信息：
        </div>
        <div class="popup-content-line">（a）事先获得客户的明确授权；</div>
        <div class="popup-content-line">（b）根据有关的法律法规要求；</div>
        <div class="popup-content-line">（c）按照相关司法机关和/或政府主管部门的要求；</div>
        <div class="popup-content-line">（d）为维护社会公众的利益所必需且适当；</div>
        <div class="popup-content-line">（e）为维护我公司或客户的合法权益所必需且适当。</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toRefs, reactive } from 'vue'

const data = reactive({
  open: false,
})
const { open } = toRefs(data)

const openDialog = () => {
  open.value = true
}

const close = () => {
  open.value = false
}

defineExpose({
  openDialog,
})
</script>

<style scoped>
.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 0 20px;
  box-sizing: border-box;
}

.popup-box {
  width: 100%;
  max-height: 60vh;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.popup-header {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  font-size: 18px;
}

.popup-title {
  padding-left: 18px;
  flex: 1;
  display: flex;
  justify-content: center;
}

.popup-body {
  padding: 0 16px 16px;
  overflow-y: auto;
}
.popup-content-line {
  font-size: 14px;
  padding: 11px 0;
}
</style>
