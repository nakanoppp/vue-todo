window.onload=function(){
  // 算出プロパティ
  const filters = {
    plan: function(items){
      return items.filter(function(item){
        return item.status === 0;
      });
    },
    done: function(items){
      return items.filter(function(item){
        return item.status === 1;
      });
    }
  };

  // cookieにitems配列を文字列でセットする
  // max-ageに秒数をセットするとそれが保存期間になる
  const setCookie = function(items){
    let setCookie = 'items=' + JSON.stringify(encodeURIComponent(items));
    setCookie += '; max-age=' + (2*60*60*24);
    document.cookie = setCookie;
  };

  // cookieからitemsを取得する
  const getCookie = function(){
    let result = [];
    if (document.cookie === ""){ return result; }

    const cookieItems = document.cookie.split('; ')[0].split('=')[1];
    result = JSON.parse(decodeURIComponent(cookieItems));
    return result;
  };

  // todoアイテムのコンポーネント
  Vue.component('todo-item', {
    props: ['item'],
    template:`
    <div class="item">
      <div class="item-name">{{item.name}}</div>
      <div>
        <div class="button-left">
          <button type="button" class="button-item" @click="toDone(item)" v-if="isStatus(item)">{{itemStatusStr(item)}}</button>
          <button type="button" class="button-item" @click="toPlan(item)" v-else>{{itemStatusStr(item)}}</button>
        </div>
        <div class="button-right">
          <button type="button" class="button-delete" @click="itemDelete(item.id)">×</button>
        </div>
      </div>
    </div>
    `,
    // コンポーネントのテンプレートで使うメソッドはコンポーネント内で記述する
    methods: {
      toDone: function(item){
        item.status++;
      },
      toPlan: function(item){
        item.status--;
      },
      itemDelete: function(id){
        // 他コンポーネントの要素にアクセスするときの記述
        app.items = app.items.filter(function(item){
          return item.id !== id;
        });
        setCookie(app.items);
      },
      isStatus: function(item){
        return item.status === 0 ? true : false;
      },
      itemStatusStr: function(item){
        return item.status === 0 ? '完了' : '戻す';
      }
    }
  });

  let app = new Vue({
    el: '#vue',
    data: {
      items: getCookie(),
      id: 0,
      newItemName: '',
    },
    computed: {
      planList: function(){
        return filters.plan(this.items);
      },
      doneList: function(){
        return filters.done(this.items);
      }
    },
    methods: {
      create(){
        if(!this.newItemName == ''){
          this.items.push({id: this.id, name: this.newItemName, status: 0});
          this.newItemName = '';
          this.id++;
        }
        setCookie(this.items);
        console.log(document.cookie);
      },
      toClipboard(){
        let text = '';
        for(let item of this.items){
          text += '・' + item.name + '\n';
        }
        let copyArea = document.createElement('textarea');
        copyArea.value = text;
        const bodyElm = document.getElementsByTagName("body")[0];
        bodyElm.appendChild(copyArea);
        copyArea.select();
        let copy = document.execCommand('copy');
        bodyElm.removeChild(copyArea);
        console.log('copy');
      }
    }
  });
};
