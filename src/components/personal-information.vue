<template>
  <div v-if="showDialog" class="dialog-mask">
    <div class="dialog-box" @click.stop>
      <div class="dialog-title">个人信息收集证明</div>
      <div class="dialog-content">
        <div class="dialog-content-title">《关于客户个人信息收集、使用及保护的公告》</div>
        <div class="dialog-content-honorific">尊敬的客户：</div>
        <div class="dialog-content-honorific">您好！</div>
        <div class="dialog-paragraph">
          根据《中华人民共和国网络安全法》、《全国人民代表大会常务委员会关于加强网络信息保护的决定》、《电信和互联网用户个人信息保护规定》(工业和信息化部令第24号)和《电话用户真实身份信息登记规定》(工业和信息化部令第25号)等国家法律法规的要求，客户在我公司名类营业网点(含自有营业厅、手机营业厅、网上营业厅、授权合作代理店等)办理移动电话(含无线上网卡)、固定电话、家庭宽带入网、过户以及需要出示客户证件的有关业务时，客户应配合出示有效身份证件原件并进行查验登记。登记信息包括姓名或名称、证件类型、号码及地址等。同时，为更好地提供服务，需要客户提供如联系人联系电话、通信地址、电子邮箱等信息。客户本人持有效身份证件可通过自有营业厅查询和/或更正本人信息，或登录手机营业厅查询本人信息。如客户拒绝依法提供个人有效证件及真实信息，我公司有权不提供服务或终止服务。
        </div>
        <div class="dialog-paragraph">
          为向客户提供优质、个性化的服务，包括但不限于提供通信服务、保障通信服务安全、改善服务质量、推介个性化产品等，我公司将遵循合法、正当、必要的原则，按照法律法规规定和/或协议约定使用留存客户个人信息，并妥善保管，严格保密，依法保护客户个人信息，非因下列事由不对外提供客户个人信息:
        </div>
        <div class="dialog-paragraph">1）事先获得客户的明确授权；</div>
        <div class="dialog-paragraph">2）根据有关的法律法规要求；</div>
        <div class="dialog-paragraph">3）按照相关司法机关和/或政府主管部门的要求；</div>
        <div class="dialog-paragraph">4）为维护社会公众的利益所必需且适当；</div>
        <div class="dialog-paragraph">5）为维护我公司或客户的合法权益所必需且适当；</div>
        <div class="dialog-paragraph">
          6）为确保您能成功办理中国移动独立或与我们合作的运营活动，我们会将您提交的信息提供给中国移动。
        </div>
      </div>
      <div class="dialog-footer">
        <div class="btn cancel" @click="handleCancel">取消</div>
        <div class="btn confirm" @click="handleAgree">确认</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['agree'])
const showDialog = ref(false)
const handleCancel = () => {
  showDialog.value = false
  emit('agree', false)
}
const handleAgree = async () => {
  emit('agree', true)
  showDialog.value = false
}

const openDialog = () => {
  showDialog.value = true
}

defineExpose({
  openDialog,
})
</script>

<style scoped>
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 0 20px;
  box-sizing: border-box;
}

.dialog-box {
  max-height: 80vh;
  width: 100%;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.dialog-title {
  padding: 14px 0 8px;
  color: #141414;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  line-height: 25px;
  letter-spacing: 0.4px;
}
.dialog-content {
  overflow-y: auto;
  padding: 0 14px 14px;
  color: #111;
  font-size: 15px;
  font-weight: 400;
  line-height: 22.5px;
  letter-spacing: 0.3px;
}

.dialog-content-title {
  text-align: center;
}

.dialog-content-honorific {
  padding-left: 45px;
}

.dialog-paragraph {
  text-indent: 45px;
}

.dialog-footer {
  display: flex;
  border-top: 1px solid #e1e1e1;
}

.btn {
  flex: 1;
  padding: 16px 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px; /* 131.25% */
  letter-spacing: 0.32px;
}

.cancel {
  text-align: center;
  color: #333;
  border-right: 1px solid #e1e1e1;
}

.confirm {
  text-align: center;
  color: #fa252c;
}
</style>
