var eleContainer=document.querySelector('#container');

// 使用localStorage
// localStorage={liNOTWancheng:'[]',liWancheng:'[]',activeTab:'liNOTWancheng'}
var strLiNOTWanchengSave=window.localStorage.liNOTWancheng || '[]';
var strLiWanchengSave=window.localStorage.liWancheng || '[]';
var strActiveTab=window.localStorage.activeTab || 'liNOTWancheng';

var arrLiNOTWanchengSave=JSON.parse(strLiNOTWanchengSave);
var arrLiWanchengSave=JSON.parse(strLiWanchengSave);
// 全局變量 bClickAddButton ，用來決定addInput是否需要失焦
var bClickAddButton=false;
// 類R state
class R extends React.Component{
  constructor(props) {
    super(props);
    // console.log(props);
    this.state={liNOTWancheng:arrLiNOTWanchengSave,liWancheng:arrLiWanchengSave,activeTab:strActiveTab};
    //this.state={liNOTWancheng:'[]',liWancheng:'[]',activeTab:'liNOTWancheng'}
  }
  rSelectLi(numTimestampHaomiao){
    var arrStateLi=this.state[this.state.activeTab];
    //選中反轉(onChange),setState is a function
    arrStateLi=arrStateLi.map(function(v){
      if(v.numTimestampHaomiao===numTimestampHaomiao){
        v.bSelect=!v.bSelect;
      }
      return v;
    });

    var objState={};
    objState[this.state.activeTab]=arrStateLi;
    this.setState(objState);
    //存貯于localStorage
    window.localStorage[this.state.activeTab]=JSON.stringify(arrStateLi);
  }
  rSelectSingle(numTimestampHaomiao){
    var arrStateLi=this.state[this.state.activeTab];
    var i=arrStateLi.findIndex(function(v){
      return v.numTimestampHaomiao===numTimestampHaomiao;
    });
    //存貯操作之前的選擇狀態
    var bSelectBeforeO=arrStateLi[i].bSelect;
    var numSelect=0;
    for(var j=0;j<arrStateLi.length;j++){
      if(arrStateLi[j].bSelect){
        numSelect++;
      }
      // 全部設為未選中
      arrStateLi[j].bSelect=false;
    }
    // 如果只有一條被選中，則反轉當前點擊，否則始終設置當前為選中
    if(numSelect===1){
      arrStateLi[i].bSelect=!bSelectBeforeO;
    }else{
      arrStateLi[i].bSelect=true;
    }

    // console.log(JSON.stringify(arrStateLi));
    var objState={};
    objState[this.state.activeTab]=arrStateLi;
    this.setState(objState);
    //存貯于localStorage
    window.localStorage[this.state.activeTab]=JSON.stringify(arrStateLi);
  }
  rEditLi(numLiIndex,strNeirong,strXinde){
    var arrStateLi=this.state[this.state.activeTab];

    arrStateLi[numLiIndex].strNeirong=strNeirong;
    arrStateLi[numLiIndex].strXinde=strXinde;

    // this.setState({liNOTWancheng:arrStateLi});
    var objState={};
    objState[this.state.activeTab]=arrStateLi;
    this.setState(objState);
    //存貯于localStorage
    window.localStorage[this.state.activeTab]=JSON.stringify(arrStateLi);
  }
  // 添加
  rAddLi(strNeirong){
    var arrStateLi=this.state[this.state.activeTab];

    var objLi={strNeirong:strNeirong,strXinde:"",numTimestampHaomiao:Date.now(),bMatchSearch:false,bSelect:false};
    arrStateLi.push(objLi);

    var objState={};
    objState[this.state.activeTab]=arrStateLi;
    this.setState(objState);
    //存貯于localStorage
    window.localStorage[this.state.activeTab]=JSON.stringify(arrStateLi);
  }
  rDeleteLi(){
    var arrStateLi=this.state[this.state.activeTab];
    arrStateLi=arrStateLi.filter(function(v){
      return !v.bSelect;
    });

    var objState={};
    objState[this.state.activeTab]=arrStateLi;
    this.setState(objState);
    //存貯于localStorage
    window.localStorage[this.state.activeTab]=JSON.stringify(arrStateLi);
  }
  rChangeStatus(){
    var strOppositeKey='';
    // arrOpposite的key有可能是liNOTWancheng，也有可能liWancheng
    if(this.state.activeTab==='liNOTWancheng'){
      strOppositeKey='liWancheng';
    }else{
      strOppositeKey='liNOTWancheng';
    }
    var arrStateLi=this.state[this.state.activeTab];
    var arrOpposite=this.state[strOppositeKey];

    // 將取消選擇，由未完成移向已完成
    arrStateLi.forEach(function(v){
      if(v.bSelect){
        // v.bSelect=false;
        arrOpposite.push(v);
        // arrStateLi.splice(i,1);
      }
    });
    //filter:留下未選擇的
    arrStateLi=arrStateLi.filter(function(v){
      return !v.bSelect;
    });
    //arrOpposite:取消選擇
    arrOpposite.forEach(function(v){
      if(v.bSelect){
        v.bSelect=false;
      }
    });

    var objState={};
    objState[this.state.activeTab]=arrStateLi;
    objState[strOppositeKey]=arrOpposite;
    this.setState(objState);
    //存貯于localStorage
    window.localStorage[this.state.activeTab]=JSON.stringify(arrStateLi);
    window.localStorage[strOppositeKey]=JSON.stringify(arrOpposite);
  }
  rSelectAllOrNone(){
    var arrStateLi=this.state[this.state.activeTab];
    var bNowStatusIsSelectAll=false;
    var numNowStatusIsSelectAll=arrStateLi.findIndex(function(v){
      return !v.bSelect;
    });
    if(numNowStatusIsSelectAll===-1){
      bNowStatusIsSelectAll=true;
    }

    arrStateLi=arrStateLi.map(function(v){
      if(bNowStatusIsSelectAll){
        v.bSelect=false;
      }else{
        v.bSelect=true;
      }

      return v;
    });

    var objState={};
    objState[this.state.activeTab]=arrStateLi;
    this.setState(objState);
    //存貯于localStorage
    window.localStorage[this.state.activeTab]=JSON.stringify(arrStateLi);
  }
  rDisplayWancheng(bWancheng){
    var strActiveTab=bWancheng?'liWancheng':'liNOTWancheng';

    var objState={};
    objState.activeTab=strActiveTab;
    this.setState(objState);
    //存貯于localStorage
    window.localStorage.activeTab=strActiveTab;
  }

  //包括 Tab，GlobalOperate，Add，TaskList,Detail
  render(){
    var componentAdd;
    if(this.state.activeTab==='liNOTWancheng'){
      componentAdd=<Add rAddLi={this.rAddLi.bind(this)} />;
    }
    return (
      <section className="capital_r">
        <div className="remember">
          <Tab propLi={this.state} rDisplayWancheng={this.rDisplayWancheng.bind(this)} />
          <GlobalOperate propLi={this.state} rDeleteLi={this.rDeleteLi.bind(this)} rChangeStatus={this.rChangeStatus.bind(this)} rSelectAllOrNone={this.rSelectAllOrNone.bind(this)} />
          {componentAdd}
          <TaskList propLi={this.state} rSelectLi={this.rSelectLi.bind(this)} rSelectSingle={this.rSelectSingle.bind(this)} />
        </div>
        <Detail propLi={this.state} rEditLi={this.rEditLi.bind(this)} />
      </section>
    );
  }
}

// 類Tab
class Tab extends React.Component{
  constructor(props){
    super(props);
    // console.log(props);
  }
  displayWancheng(bWancheng){
    return ()=>{
      this.props.rDisplayWancheng(bWancheng);
    }
  }

  render(){
    var strActiveTab=this.props.propLi.activeTab;
    var arrActiveOrNot=[];
    // console.log(strActiveTab);

    if(strActiveTab==='liNOTWancheng'){
      arrActiveOrNot=['active',''];
    }else{
      arrActiveOrNot=['','active']
    }

    return (
      <div className="tab">
        <a href="javascript:;" className={arrActiveOrNot[0]} onClick={this.displayWancheng(false).bind(this)}>未完成</a>
        <a href="javascript:;" className={arrActiveOrNot[1]} onClick={this.displayWancheng(true).bind(this)}>已完成任務</a>
      </div>
    );
  }
}
// 類GlobalOperate
class GlobalOperate extends React.Component{
  constructor(props){
    super(props);
    // console.log(props);
  }
  deleteLi(){
    this.props.rDeleteLi();
  }
  changeStatus(){
    this.props.rChangeStatus();
  }
  selectAllOrNone(){
    this.props.rSelectAllOrNone();
  }

  render(){
    var Rdata=this.props.propLi[this.props.propLi.activeTab];

    var numChecked=Rdata.findIndex(function(v){
      return (!v.bSelect);
    });
    // 全選
    var bChecked=false;
    // -1代表全部select，Rdata為空數組。注意：空數組轉為布爾值時為真
    if(numChecked===-1 && Rdata.length){
      bChecked=true;
    }
    var strWanchengStatus='';
    // console.log(this.props.propLi.activeTab);
    if(this.props.propLi.activeTab==='liNOTWancheng'){
      strWanchengStatus='已';
    }else{
      strWanchengStatus='未';
    }

    return (
      <div className="global_operate">
        <p className="select checkbox_wrap">
          <input type="checkbox" id="cbtest" onChange={this.selectAllOrNone.bind(this)} type="checkbox" checked={bChecked} />
          <label htmlFor="cbtest" className="check-box">
            <span></span>
          </label>
        </p>
        <a href="javascript:;" className="complete" onClick={this.changeStatus.bind(this)}>標記為{strWanchengStatus}完成</a>
        <a href="javascript:;" className="delete" onClick={this.deleteLi.bind(this)}>刪除</a>
      </div>
    );
  }
}
// 類add
class Add extends React.Component{
  constructor(props){
    super(props);
    // console.log(props);
  }
  // onFocus
  displayAddButton(){
    this.eleButton.style.display='';
    this.enableAddButton();
    bClickAddButton=false;
  }
  // onBlur
  handleBlur(){
    if(bClickAddButton){
      //如若點擊了addButton
      window.setTimeout(()=>{
        this.eleInput.focus();
      },0);
    }else{
      //正常失焦，button隱藏
      this.eleButton.style.display='none';
    }
  }
  enableAddButton(){
    var strEmptyString=this.eleInput.value;
    if(strEmptyString.trim()===''){
      this.eleButton.disabled=true;
    }else{
      this.eleButton.disabled=false;
    }
  }
  // onMouseDown 先于blur，blur先于click
  // onMouseDown ,點擊了按鈕
  addLi(){
    var strNeirong=this.eleInput.value;
    this.props.rAddLi(strNeirong);
    this.eleInput.value='';
    bClickAddButton=true;
  }
  render(){
    return (
      <div className="add">
        <input ref={(a)=>{this.eleInput=a}} type="text" placeholder="添加一個任務" onFocus={this.displayAddButton.bind(this)} onBlur={this.handleBlur.bind(this)} onInput={this.enableAddButton.bind(this)} />
        <button ref={(a)=>{this.eleButton=a}} style={{display:'none'}} type="button" onMouseDown={this.addLi.bind(this)}>add</button>
      </div>
    );
  }
}
// 類TaskList
class TaskList extends React.Component{
  constructor(props){
    super(props);
    // console.log('86'+JSON.stringify(props));
  }
  selectLi(numTimestampHaomiao){
    return ()=>{
      this.props.rSelectLi(numTimestampHaomiao);
    }
  }
  selectSingle(numTimestampHaomiao){
    return ()=>{
      this.props.rSelectSingle(numTimestampHaomiao);
    }
  }
  //stopPropagation:以防對p的點擊事件selectSingle造成影響
  stop(ev){
    ev.stopPropagation();
  }
  render(){
    //arrP 畫筆記本橫線
    var numLine=20;
    var arrP=[];
    for(var i=0;i<numLine;i++){
      arrP.push(<p key={i}></p>);
    }

    // arrLi,此處map()必須用箭頭函數，否則this為undefined
    var Rdata=this.props.propLi[this.props.propLi.activeTab];
    Rdata.sort(function(a,b){
      return a.strNeirong.localeCompare(b.strNeirong);
    });

    var arrLi=Rdata.map((v,i)=>{
      var strActiveOrNot=v.bSelect?'active':'';
      return (
        <li key={v.numTimestampHaomiao} className={strActiveOrNot}>
          <p onClick={this.selectSingle(v.numTimestampHaomiao).bind(this)}>
            <input checked={v.bSelect} type="checkbox" onClick={this.stop.bind(this)} onChange={this.selectLi(v.numTimestampHaomiao).bind(this)} />
            <span>{v.strNeirong}</span>
          </p>
        </li>
      );
    });
    return (
      <div className="task_list">
        <div className="bg_line">
          {arrP}
        </div>
        <ul>
          {arrLi}
        </ul>
      </div>
    );
  };
}
// 類detail
class Detail extends React.Component{
  constructor(props){
    super(props);
    // console.log(JSON.stringify(props));
  }
  editLi(numLiIndex){
    return ()=>{
      // 獲取輸入內容,ref={函數}
      var strNeirong=this.eleInput.value;
      var strXinde=this.eleTextarea.value;
      this.props.rEditLi(numLiIndex,strNeirong,strXinde);
    }
  }
  discard(strNeirongBefore,strXindeBefore){
    return ()=>{
      // 手動模擬設置輸入值為原始值來執行函數displayResetButton
      this.eleInput.value=strNeirongBefore;
      this.eleTextarea.value=strXindeBefore;
      // (this.displayResetButton(strNeirongBefore,strXindeBefore))(); 1,2,3,4
      this.eleSubmit.style.display='none';
      this.eleReset.style.display='none';
      this.eleInput.style.backgroundColor='#FFF';
      this.eleTextarea.style.backgroundColor='#FFF';
    }
  }
  displayResetButton(strNeirongBefore,strXindeBefore){
    return ()=>{
      var strNeirong=this.eleInput.value;
      var strXinde=this.eleTextarea.value;
      //當標題與心得都沒發生改變時才不顯示按鈕
      if(strNeirong===strNeirongBefore && strXinde===strXindeBefore){
        this.eleSubmit.style.display='none';
        this.eleReset.style.display='none';
      }else{
        this.eleSubmit.style.display='';
        this.eleReset.style.display='';
      }
      // 標題內容，輸入框
      if(strNeirong!==strNeirongBefore){
        this.eleInput.style.backgroundColor='#FFE7D7';
      }else{
        this.eleInput.style.backgroundColor='#FFF';
      }
      // 心得，文本框
      if(strXinde!==strXindeBefore){
        this.eleTextarea.style.backgroundColor='#FFE7D7';
      }else{
        this.eleTextarea.style.backgroundColor='#FFF';
      }
    }
  }
  render(){
    var Rdata=this.props.propLi[this.props.propLi.activeTab];
    var numSelect=0;
    var numLiIndex=0;
    for(var i=0;i<Rdata.length;i++){
      if(Rdata[i].bSelect){
        numSelect++;
        numLiIndex=i;
      }
    }

    //當只選中一個，則顯示任務詳情，否則返回null，不顯示
    if(numSelect===1){
      return (
        <div className="detail" key={Math.random()}>
          <p>任務標題：</p>
          <input ref={(a)=>{this.eleInput=a;}} type="text" defaultValue={Rdata[numLiIndex].strNeirong} placeholder="任務" onInput={this.displayResetButton(Rdata[numLiIndex].strNeirong,Rdata[numLiIndex].strXinde).bind(this)} />
          <p>您的心得：</p>
          <textarea ref={(a)=>{this.eleTextarea=a;}} defaultValue={Rdata[numLiIndex].strXinde} placeholder="心得" onInput={this.displayResetButton(Rdata[numLiIndex].strNeirong,Rdata[numLiIndex].strXinde).bind(this)}></textarea>
          <button ref={(a)=>{this.eleSubmit=a;}} style={{display:'none'}} type="button" onClick={this.editLi(numLiIndex).bind(this)}>確定</button>
          <button ref={(a)=>{this.eleReset=a;}} style={{display:'none'}} type="button" onClick={this.discard(Rdata[numLiIndex].strNeirong,Rdata[numLiIndex].strXinde).bind(this)}>取消</button>
        </div>
      );
    }else{
      return null;
    }

  }
}




















ReactDOM.render(<R />,eleContainer);
