<template>
  <div v-if="open" class="popup-mask" @click="close">
    <div class="popup-box" @click.stop>
      <div class="popup-header">
        <span class="popup-title">《个人隐私协议》</span>
        <span class="popup-close" @click="close">×</span>
      </div>
      <div class="popup-body">
        <div class="popup-content-line">更新日期：2024年10月1日</div>
        <div class="popup-content-line">生效日期：2024年10月1日</div>
        <div class="popup-content-line">
          提示条款H5页面由咪咕文化科技有限公司（或简称“我们"）运营。用户（又称“您”）访问使用H5
          页面过程中，我们可能收集和使用您的相关
          信息。您的信任对我们非常重要，我们深知用户信息安全的重要性，我们将按照法律法规要求，采取安全保护措施，保护您的用户信
          息安全可控。鉴于此，我们制定《用户隐私政策》（简称“本隐私政策”）并提醒您：在使用我们的各项服务前，请您务必仔细阅读并
          充分理解本隐私政策，在确认充分理解并同意后方访问使用H5页面。一旦您开始访问使用，将被视为对本隐私政策内容的接受和认可。
        </div>
        <div class="popup-content-line">
          在接受本隐私政策之前，请您仔细阅读本隐私政策的全部内容。如果您对本隐私政策的条款有疑问的，请通过本政策提供的联系方式
          与我们联系。如果您不同意本隐私政策任何的条款，或者无法准确理解我们对条款的解释，请不要进行后续作。
        </div>
        <div class="popup-content-line">
          定义H5页面：由我们开发的H5页面，主要用于内容运营、活动营销和业务推广。H5页面提供者：指H5页面的开发者咪咕文化科技有限公司。
        </div>
        <div class="popup-content-line">
          个人信息：指以电子或者其他方式记录的与己识别或者可识别的自然人有关的各种信息，不包括匿名化处理后的信息。个人信息包括
          自然人的姓名、出生日期、身份证件号码、个人生物识别信息、住址、电话号码。本隐私权政策的个人信息是我们向您提供服务为目
          的而收集、传输、存储、使用、加工、提供、公开、删除您的个人信息。
        </div>
        <div class="popup-content-line">
          个人敏感信息：指一旦泄露或者非法使用，容易导致自然人的人格尊严受到侵害或者人身、财产安全受到危害的个人信息，包括生物
          识别、宗教信仰、特定身份、医疗健康、金融账户、行踪轨迹信息，以及不满十四周岁未成年人的个人信息。
        </div>
        <div class="popup-content-line">
          个人信息删除：指在实现日常业务功能所涉及的系统中去除个人信息的行为，使其保持不可被检索、访问的状态。
        </div>
        <div class="popup-content-line">
          去标识化：是指个人信息经过处理，使其在不借助额外信息的情况下无法识别特定自然人的过程。
        </div>
        <div class="popup-content-line">
          匿名化：是指个人信息经过处理无法识别特定自然人且不能复原的过程。
        </div>
        <div class="popup-content-line">隐私政策</div>
        <div class="popup-content-line">本政策适用H5页面的所有产品和服务。</div>
        <div class="popup-content-line">
          需要特别说明的是，本协议不适用于第三方向您提供的服务或产品，当您通过H5
          页面跳转到第三方的网页、客户端或程序时，您向该 第三方服务商提供的个人信息不适用本协议。
        </div>
        <div class="popup-content-line">
          在访问使用H5页面前，请您务必仔细阅读并透彻理解本协议，特别是加粗、加下划线标识的条款，您应重点阅读，在充分理解并同意
          接受后开始使用。如对本协议有任何疑问，您可通过以下联系方式：400-902-1355(在线时间
          09:00-19:00)与我们联系。
        </div>
        <div class="popup-content-line">
          如您为未满18周岁的未成年人，请在法定监护人陪同下阅读本协议，并特别注意未成年人使用条款。
        </div>
        <div class="popup-content-line">本协议主要向您说明：</div>
        <div class="popup-content-line">一、我们收集您哪些个人信息。</div>
        <div class="popup-content-line">二、我们如何使用您的个人信息。</div>
        <div class="popup-content-line">三、我们在何种情况下共享、转让及公开披露您的个人信息。</div>
        <div class="popup-content-line">四、我们如何存储您的个人信息。</div>
        <div class="popup-content-line">五、我们如何保护您的个人信息。</div>
        <div class="popup-content-line">六、您所享有的权利。</div>
        <div class="popup-content-line">七、未成年人信息如何保护。</div>
        <div class="popup-content-line">八、您如何联系我们。</div>
        <div class="popup-content-line">九、条款更新。</div>
        <div class="popup-content-line">一、我们收集您哪些个人信息</div>
        <div class="popup-content-line">
          我们收集您的信息以合法、合理、必要为原则，在向您提供某项具体服务时，我们将明确告知您将收集的信息以及用途，来响应您具
          体的服务请求。根据您选择的服务，我们在以下场景可能收集以下信息的一种或多种：
        </div>
        <div class="popup-content-line">（一）基本功能</div>
        <div class="popup-content-line">1. 注册登录</div>
        <div class="popup-content-line">
          为了给您提供更好的服务，我们会帮助您注册成为我们的用户，您可通过本机号码一键免密，或通过手机验证码完成注册登录，我们
          均会在上述过程中，在征得您的同意后收集您的手机号码；通过微信登录时，还会额外请求收集您在微信平台的头像、昵称；如果推
          绝提供，我们将无法为您创建用户账号，从而无法使用H5页面中的部分功能和服务。
        </div>
        <div class="popup-content-line">2. 浏览服务</div>
        <div class="popup-content-line">
          在您浏览H5页面时，为保证和优化H5
          页面适配展示、识别账号异常状态、识别设备异常状态，我们会收集您的浏览、点击查看、搜
          索记录。我们可能会自动收集您的使用情况并存储为网络日志信息，包括：（1）设备信息：我们会根据您在使用中的具体操作，接收
          并记录您所使用的设备相关信息（包括设备型号、操作系统版本），以便做好不同终端、不同系统界面适配。（2）日志信息：当您使用
          我们H5页面提供的服务时，我们会自动收集您对我们服务的详细使用情况，作为有关网络日志保存，包括您的账号信息、设备信息、
          IP 地址、运营商信息、WIFI状态、访问日期和时间、以及出现故障时的错误日志。
        </div>
        <div class="popup-content-line">3. 付费内容</div>
        <div class="popup-content-line">
          当您开通会员、订购彩铃、设置彩铃、购买付费音乐时，我们将收集您的交易信息，包括账号、订购金额、订购对象、订购服务、i
          购时间。如您不同意我们收集前述信息，将影响您订购使用我们的付费服务，但不影响您使用我们提供的其他服务。
        </div>
        <div class="popup-content-line">4. 抽奖活动</div>
        <div class="popup-content-line">
          我们会不定期开展活动，在您中奖时，会请求您提供姓名、联系方式、地址用于奖品寄送。这些信息属于个人敏感信息，您可以拒绝
          提供，如果拒绝提供，您将可能无法参与运营活动或无法获得奖品，但不影响其他功能与服务的正常使用。
        </div>
        <div class="popup-content-line">5. 微信分享</div>
        <div class="popup-content-line">
          当您使用微信分享内容时，我们会获取微信的授权，收集您的头像、昵称，以便保障您能正常分享内容到微信平台。如您不同意我们
          收集前述信息，在使用微信分享服务时可能出现异常。
        </div>
        <div class="popup-content-line">6. 客服及问题解决</div>
        <div class="popup-content-line">
          通过客服咨询方式与我们联系：当您与我们联系时，我们将收集您提供的咨询内容以及您的联系方式（账号、住址、邮箱、通信/通语
          记录和内容或您留下的其他联系方式），以便与您联系或帮助您解决问题，或记录相关问题的处理方案及结果。如您不提供前述信息,
          将可能影响我们无法联系到您或帮助您解决问题。
        </div>
        <div class="popup-content-line">7、安全保障</div>
        <div class="popup-content-line">
          我们需要收集您的一些信息来保障您访问使用我们15 页面时的账号安全，并协助提升我们日5
          页面的可靠性，以防产生任何危害用户
          企业、社会的行为，包括您的如下信息：设备型号、操作系统版本、IP地址、运营商信息、WIFI状态、访问日期和时间、服务故障信
          息。我们的H5页面中统一应用了WEB动态防御技术，在您访问我们的H5
          页面时，我们会收集您的传感器信息进行人机识别、可靠性
          验证和安全防护。我们会根据上述信息来综合判断您账号和交易风险、进行身份验证、客户服务、检测及防范安全事件、存档和备份
          用途，并依法采取必要的记录、审计、处置措施。
          请注意，单独的设备信息、设备运行信息是无法识别特定自然人身份的信息。如果我们将这类非个人信息与其他信息结合用于识别特
          定自然人身份，或者将其与个人信息结合使用，则在结合使用期间，这类非个人信息将被视为个人信息，除取得您授权或法律法规牙
          有规定外，我们会将该类个人信息做匿名化、去标识化处理。
          我们收集、使用的上述信息均进行了去标识化处理，数据分析仅对应特定的、无法直接关联您身份的编码，不会与您的真实身份相》
          联。如果您不提供上述权限和信息，不影响您使用我们提供的其他服务。
        </div>
        <div class="popup-content-line">（二）我们如何使用 Cookie 和同类技术</div>
        <div class="popup-content-line">
          为确保H5页面能正常提供服务，我们会在您的移动设备上存储名为Cookie的小数据文件。Cookie通常包含标识符、站点名称、手机
          型号、系统类型、系统版本、设备屏幕尺寸。借助于Cookie能够存储您的偏好数据。我们可能会利用和类似技术了解您的偏好和使用习惯，进行数据分析，以便帮助我们改进服务效率，提升响应速度。我们不会将Cookie用于本政策所述目的之外的任何用途。
        </div>
        <div class="popup-content-line">（三）征得授权问意的例外</div>
        <div class="popup-content-line">
          您充分理解并同意，我们在以下情况下收集、使用您的个人信息无需您的授权同意：
        </div>
        <div class="popup-content-line">1、为履行法定职责或者法定义务所必需；</div>
        <div class="popup-content-line">
          2、为应对突发公共卫生事件，或者紧急情况下为保护自然人的生命健康和财产安全所必需；
        </div>
        <div class="popup-content-line">
          3、依照本法规定在合理的范围内处理个人自行公开或者其他已经合法公开的个人信息；
        </div>
        <div class="popup-content-line">4、法律、行政法规规定的其他情形。</div>
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
