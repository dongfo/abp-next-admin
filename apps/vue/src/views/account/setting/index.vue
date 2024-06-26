<template>
  <ScrollContainer>
    <div ref="wrapperRef" class="account-setting">
      <Tabs tab-position="left" :tabBarStyle="{ width: '220px' }">
        <template v-for="item in getSettingList()" :key="item.key">
          <TabPane :tab="item.name">
            <component
              :is="componentsRef[item.component]"
              :profile="profileRef"
              @profile-change="initUserInfo"
            />
          </TabPane>
        </template>
      </Tabs>
    </div>
  </ScrollContainer>
</template>

<script lang="ts" setup>
  import { defineAsyncComponent, ref, shallowRef, onMounted } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import { ScrollContainer } from '/@/components/Container/index';
  import { getSettingList } from './data';
  import { get as getProfile } from '/@/api/account/profiles';
  import { MyProfile } from '/@/api/account/profiles/model';
  import { useAbpStoreWithOut } from '/@/store/modules/abp';
  import BaseSetting from './BaseSetting.vue';

  const TabPane = Tabs.TabPane;
  const SecureSetting = defineAsyncComponent(() => import('./SecureSetting.vue'));
  const AccountBind = defineAsyncComponent(() => import('./AccountBind.vue'));
  const MsgNotify = defineAsyncComponent(() => import('./MsgNotify.vue'));
  const Authenticator = defineAsyncComponent(() => import('./Authenticator.vue'));

  const componentsRef = shallowRef({
    BaseSetting: BaseSetting,
    SecureSetting: SecureSetting,
    AccountBind: AccountBind,
    MsgNotify: MsgNotify,
    Authenticator: Authenticator,
  });

  const profileRef = ref<MyProfile>();
  onMounted(fetchProfile);

  async function fetchProfile() {
    const profile = await getProfile();
    profileRef.value = profile;
  }

  async function initUserInfo() {
    const abpStore = useAbpStoreWithOut();
    await abpStore.initlizeAbpApplication();
    await fetchProfile();
  }
</script>
<style lang="less">
  .account-setting {
    margin: 12px;
    background-color: @component-background;

    .base-title {
      padding-left: 0;
    }

    .ant-tabs-tab-active {
      background-color: @item-active-bg;
    }
  }
</style>
