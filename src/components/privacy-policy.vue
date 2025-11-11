<template>
  <div v-if="open" class="popup-mask" @click="close">
    <div class="popup-box" @click.stop>
      <div class="popup-header">
        <span class="popup-title">{{ title }}</span>
        <span class="popup-close" @click="close">×</span>
      </div>
      <div class="popup-body" v-if="title === '个人信息收集证明'">
        <div class="popup-content-line">
          1.用户信息公开情况说明尊重用户个人隐私是我司的一项基本政策。所以，我司不会在未经合法用户授权时公开、编辑或透露其注册资料及保存在本应用中的非公开内容，除非有下列情况：
        </div>
        <div class="popup-content-line">(1)有关法律规定或我司合法服务程序规定；</div>
        <div class="popup-content-line">(2)在紧急情况下，为维护用户及公众的权益；</div>
        <div class="popup-content-line">(3)为维护我司的商标权、专利权及其他任何合法权益；</div>
        <div class="popup-content-line">(4)其他需要公开、编辑或透露个人信息的情况。</div>
        <div class="popup-content-line">
          2.在以下(包括但不限于)几种情况下，我司有权使用用户的个人信息：
        </div>
        <div class="popup-content-line">
          (1)在进行促销或抽奖时，我司可能会与赞助商共享用户的个人信息，在这些情况下我司会在发送用户信息之前进行提示，并且用户可以通过不参与或者关闭网络页面来终止传送过程；
        </div>
        <div class="popup-content-line">(2)我司可以将用户信息与第三方数据匹配；</div>
        <div class="popup-content-line">
          (3)我司会通过透露合计用户统计数据，向未来的合作伙伴、广告商及其他第三方以及为了其他合法目的而描述我司的服务。
        </div>
        <div class="popup-content-line">3.隐私权政策适用范围：</div>
        <div class="popup-content-line">(1)用户在登录本应用服务器时留下的个人身份信息；</div>
        <div class="popup-content-line">
          (2)用户通过本应用服务器与其他用户或非用户之间传送的各种资讯；
        </div>
        <div class="popup-content-line">(3)本应用与商业伙伴共享的其他用户或非用户的各种信息。</div>
        <div class="popup-content-line">
          4.资讯公开与共享：我司不会将用户的个人信息和资讯故意透露、出租或出售给任何第三方。但以下情况除外：
        </div>
        <div class="popup-content-line">(1)用户本人同意与第三方共享信息和资讯；</div>
        <div class="popup-content-line">
          (2)只有透露用户的个人信息和资讯，才能提供用户所要求的某种产品和服务；
        </div>
        <div class="popup-content-line">
          (3)应代表本应用提供产品或服务的主体的要求提供(除非我们另行通知，否则该等主体无权将相关用户个人信息和资讯用于提供产品和服务之外的其他用途)；
        </div>
        <div class="popup-content-line">
          (4)根据法律法规或行政命令的要求提供；因外部审计需要而提供；用户违反了本应用服务条款或任何其他产品及服务的使用规定；经本站评估，用户的帐户存在风险，需要加以保护。
        </div>
        <div class="popup-content-line">
          5.Cookies、日志档案和webbeacon：通过使用cookies，本应用向用户提供简单易行并富个性化的网络体验。cookies能帮助我们确定用户连接的页面和内容，并将该等信息储存。我们使用自己的cookies和webbeacon，用于以下用途：
        </div>
        <div class="popup-content-line">
          (1)记住用户身份。例如：cookies和webbeacon有助于我们辨认用户作为我们的注册用户的身份，或保存用户向我们提供有关用户的喜好或其他信息；
        </div>
        <div class="popup-content-line">
          (2)分析用户使用我们服务的情况。我们可利用cookies和webbeacon来了解用户使用我们的服务进行什么活动、或哪些网页或服务最受欢迎我们为上述目的使用cookies和webbeacon的同时，可能将通过cookies和webbeacon收集的非个人身份信息汇总提供给广告商和其他伙伴，用于分析您和其他用户如何使用我们的服务并用于广告服务。用户可以通过浏览器或用户选择机制拍绝或管理cookies或webbeacon。但请用户注意我们有可能如果用户停用cookies或webbeacon，主无法为您提供最佳的服务体验，某些服务也可能无法正常使用；
        </div>
        <div class="popup-content-line">
          (3)当你使用本站的服务时，我们的主机会自动记录用户的浏览器在访问网站时所发送的信息和资讯。主机日志资讯包括但不限于用户的网路请求、IP地址、浏览器类型、浏览器使用的语言、请求的日期和时间，以及一个或多个可以对用户的浏览器进行辨识的cookie。
        </div>
      </div>
      <div class="popup-body" v-if="title === '用户隐私政策'">
        <div class="popup-content-line">
          1.用户信息公开情况说明尊重用户个人隐私是我司的一项基本政策。所以，我司不会在未经合法用户授权时公开、编辑或透露其注册资料及保存在本应用中的非公开内容，除非有下列情况：
        </div>
        <div class="popup-content-line">(1)有关法律规定或我司合法服务程序规定；</div>
        <div class="popup-content-line">(2)在紧急情况下，为维护用户及公众的权益；</div>
        <div class="popup-content-line">(3)为维护我司的商标权、专利权及其他任何合法权益；</div>
        <div class="popup-content-line">(4)其他需要公开、编辑或透露个人信息的情况。</div>
        <div class="popup-content-line">
          2.在以下(包括但不限于)几种情况下，我司有权使用用户的个人信息：
        </div>
        <div class="popup-content-line">
          (1)在进行促销或抽奖时，我司可能会与赞助商共享用户的个人信息，在这些情况下我司会在发送用户信息之前进行提示，并且用户可以通过不参与或者关闭网络页面来终止传送过程；
        </div>
        <div class="popup-content-line">(2)我司可以将用户信息与第三方数据匹配；</div>
        <div class="popup-content-line">
          (3)我司会通过透露合计用户统计数据，向未来的合作伙伴、广告商及其他第三方以及为了其他合法目的而描述我司的服务。
        </div>
        <div class="popup-content-line">3.隐私权政策适用范围：</div>
        <div class="popup-content-line">(1)用户在登录本应用服务器时留下的个人身份信息；</div>
        <div class="popup-content-line">
          (2)用户通过本应用服务器与其他用户或非用户之间传送的各种资讯；
        </div>
        <div class="popup-content-line">(3)本应用与商业伙伴共享的其他用户或非用户的各种信息。</div>
        <div class="popup-content-line">
          4.资讯公开与共享：我司不会将用户的个人信息和资讯故意透露、出租或出售给任何第三方。但以下情况除外：
        </div>
        <div class="popup-content-line">(1)用户本人同意与第三方共享信息和资讯；</div>
        <div class="popup-content-line">
          (2)只有透露用户的个人信息和资讯，才能提供用户所要求的某种产品和服务；
        </div>
        <div class="popup-content-line">
          (3)应代表本应用提供产品或服务的主体的要求提供(除非我们另行通知，否则该等主体无权将相关用户个人信息和资讯用于提供产品和服务之外的其他用途)；
        </div>
        <div class="popup-content-line">
          (4)根据法律法规或行政命令的要求提供；因外部审计需要而提供；用户违反了本应用服务条款或任何其他产品及服务的使用规定；经本站评估，用户的帐户存在风险，需要加以保护。
        </div>
        <div class="popup-content-line">
          5.Cookies、日志档案和webbeacon：通过使用cookies，本应用向用户提供简单易行并富个性化的网络体验。cookies能帮助我们确定用户连接的页面和内容，并将该等信息储存。我们使用自己的cookies和webbeacon，用于以下用途：
        </div>
        <div class="popup-content-line">
          (1)记住用户身份。例如：cookies和webbeacon有助于我们辨认用户作为我们的注册用户的身份，或保存用户向我们提供有关用户的喜好或其他信息；
        </div>
        <div class="popup-content-line">
          (2)分析用户使用我们服务的情况。我们可利用cookies和webbeacon来了解用户使用我们的服务进行什么活动、或哪些网页或服务最受欢迎我们为上述目的使用cookies和webbeacon的同时，可能将通过cookies和webbeacon收集的非个人身份信息汇总提供给广告商和其他伙伴，用于分析您和其他用户如何使用我们的服务并用于广告服务。用户可以通过浏览器或用户选择机制拍绝或管理cookies或webbeacon。但请用户注意我们有可能如果用户停用cookies或webbeacon，主无法为您提供最佳的服务体验，某些服务也可能无法正常使用；
        </div>
        <div class="popup-content-line">
          (3)当你使用本站的服务时，我们的主机会自动记录用户的浏览器在访问网站时所发送的信息和资讯。主机日志资讯包括但不限于用户的网路请求、IP地址、浏览器类型、浏览器使用的语言、请求的日期和时间，以及一个或多个可以对用户的浏览器进行辨识的cookie。
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toRefs, reactive } from 'vue'

const data = reactive({
  open: false,
  title: '',
})
const { open, title } = toRefs(data)

const openDialog = (e) => {
  if (e === 1) {
    title.value = '个人信息收集证明'
  } else {
    title.value = '用户隐私政策'
  }
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
  max-height: 80vh;
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
