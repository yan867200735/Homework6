//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////、

var XulieZhen =[ 
    {tag:0,name: "1_png"},
    {tag:0,name: "2_png"},
    {tag:0,name: "3_png"},
    {tag:0,name: "4_png"},
    {tag:1,name: "11_png"},
    {tag:1,name: "12_png"},
    {tag:1,name: "13_png"},
    {tag:1,name: "14_png"},
    {tag:1,name: "15_png"},
    {tag:1,name: "16_png"},
]

class MapKuai {
   public x:number;
   public y:number;
   public canW:boolean;
   public textag:number;
}

class DaMap extends egret.DisplayObjectContainer {
    public KuaiSize=80;
    public  MapKs:Array<MapKuai>=new Array<MapKuai>();
    public  MapCs:Array<egret.DisplayObjectContainer>=new Array<egret.DisplayObjectContainer>();
    public W=0;
    public H=0;
    constructor(){
        super();
        this.LoadKs();
   //   RES.loadConfig("Ditu.ts");
        this.LoadCs();
        
    }
    private LoadKs() {
        var OneK:MapKuai;
        for(var i=0;i<Ditu.length;i++) {
            OneK=Ditu[i];          
            this.MapKs.push(OneK);
            this.W=OneK.x+1;
            this.H=OneK.y+1;
        }
    }
     private LoadCs() {
        var OneC:egret.DisplayObjectContainer;
        for(var i=0;i<this.MapKs.length;i++) {
            OneC=new egret.DisplayObjectContainer; 
            OneC.x=this.MapKs[i].x*this.KuaiSize;
            OneC.y=this.MapKs[i].y*this.KuaiSize;
            if(this.MapKs[i].textag!=0) {
            var oneBit=this.createBitmapByName(this.LoadTu(this.MapKs[i]));
             OneC.addChild(oneBit);
            }
            this.MapCs.push(OneC);
            this.addChild(OneC);  
           
        }
    }
     private LoadTu(MK:MapKuai):string {
         
         var name:string=Bittu[MK.textag-1].name;
         console.log(name);
         return name;

} 

 private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}
class Pole extends egret.DisplayObjectContainer {
    public nowDoing=0;
    public MyPhoto:egret.Bitmap;
    private MySta:StaMac=new StaMac;
    public MoveSpeed:number=20;
    public ChaTime:number=150;
    public Modle:number=0;
    public IdleAni:Array<egret.Texture>=new Array<egret.Texture>();
    public MoveAni:Array<egret.Texture>=new Array<egret.Texture>();
    public constructor(){
       super();
       this.MyPhoto=this.createBitmapByName("1_png");
       this.addChild(this.MyPhoto);
       this.LoadAni();
       this.anchorOffsetX=this.MyPhoto.width/2;
       this.anchorOffsetY=this.MyPhoto.height/2+this.MyPhoto.height/3;
   }
    private LoadAni() {
         var texture:egret.Texture ;
         for(var i=0;i<XulieZhen.length;i++) {
             texture= RES.getRes(XulieZhen[i].name);
  //         console.log(XulieZhen[i].tag);
        if(XulieZhen[i].tag==0)
        { this.IdleAni.push(texture);
     //    console.log("0");
        }
        if(XulieZhen[i].tag==1)
         {this.MoveAni.push(texture);
      //      console.log("1");
         }
        }
    }
    
    public PlayAni(Ani:Array<egret.Texture>){
      
        var count =0;
        var Bit=this.MyPhoto;
        var M=this.Modle;
     //   console.log("M:"+M);
        var timer:egret.Timer=new egret.Timer(125, 0);
        timer.addEventListener(egret.TimerEvent.TIMER,Play,this);
        timer.start();

        function Play(){      
            Bit.texture=Ani[count];
            if(count<Ani.length-1) {
             //   console.log(Ani.length+" "+count);
                count++;}
            else{count=0;}    
            if(this.Modle!=M){
     //             console.log("tM:"+M+" nowM:"+this.Modle);
                 timer.stop();}    
        }   
    }

    public Move(Ps:Array<node>,xx:number,yy:number) {
        var MS:MoveSta=new MoveSta(Ps,this);
        this.MySta.Reload(MS);      
    }
    
    public Idle() {

       var IS:IdleSta=new IdleSta(this);
       this.MySta.Reload(IS);
    

   }


   

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}

interface  Sta {
    Load();
    exit();
     
}

class MoveSta implements Sta{
    private Tx:number;
    private Ty:number;
    private Player:Pole;
    private timer: egret.Timer;
    private LeastTime:number;
    public Lj:Array<node>;
    public nowNode:number=0;
  
  //  public isArrive:boolean=false;
    public ArriveListener:egret.Sprite=new egret.Sprite();
    
    constructor(Ps:Array<node>,Player:Pole){
        this.Lj=Ps;
        this.Player=Player;

    }
    ArriveAndGoNextNodeListener(evt:FinishWalkEvent) {
        this.nowNode++;
        if(this.nowNode<this.Lj.length) {
        this.Move();
        }
        else this.Player.Idle();
    }

    Move() {
       
        var M=this.Player.Modle;     
        this.Tx=this.Lj[this.nowNode].x;
        this.Ty=this.Lj[this.nowNode].y;
        var xx=this.Tx- this.Player.x;
        var yy=this.Ty- this.Player.y;
        if(xx>0){this.Player.scaleX=-1;}else{this.Player.scaleX=1;}
        var zz=Math.pow(xx*xx+yy*yy,0.5);
        var time:number=zz/this.Player.MoveSpeed;
        this.timer = new egret.Timer(50, time);
        this.LeastTime=time;
        this.timer.start();
        
        this.timer.addEventListener(egret.TimerEvent.TIMER,()=>{
            this.Player.x+=xx/time;
            this.Player.y+=yy/time;
             this.LeastTime--;
            if( this.LeastTime<1) {
                this.timer.stop();
                
               if(this.LeastTime>-10) { 
                  
                var IFW:FinishWalkEvent=new FinishWalkEvent(FinishWalkEvent.FW);
                this.ArriveListener.dispatchEvent(IFW);
                   }//意味着是走停不是逼停
                 
             }
        }, this);
        
         
    }
    Load() {
        if(this.Lj.length>1)
        this.nowNode=1;
        else this.nowNode=0;
        this.ArriveListener.addEventListener(FinishWalkEvent.FW,this.ArriveAndGoNextNodeListener,this);
       this.Player.nowDoing=1;
        this.Player.Modle++;
        this.Player.PlayAni(this.Player.MoveAni);
        this.Move();
    }
    exit() {
        this.LeastTime=-10;
        this.ArriveListener.removeEventListener(FinishWalkEvent.FW,this.ArriveAndGoNextNodeListener,this);
    }
}
class IdleSta implements Sta{
      private Player:Pole;
      constructor(Player:Pole){  
        this.Player=Player;
    }  
    Load() {
    //    console.log("Loadidle");
     this.Player.Modle++;
     this.Player.nowDoing=0;
     this.Player.PlayAni(this.Player.IdleAni);
    }
    exit() {
      
  //   console.log("exitIdle");
    }

}
 class StaMac {
     private nowSta:Sta;
     
     public Reload(S:Sta):void{
         if(this.nowSta){
            this.nowSta.exit();
         }  
            this.nowSta=S;
            this.nowSta.Load();
     }
}




class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView:LoadingUI;
    private Player;
    private BigMap:DaMap=new DaMap();
   

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event:RES.ResourceEvent):void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield:egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene():void {
        var sky:egret.Bitmap = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        var stageW:number = this.stage.stageWidth;
        var stageH:number = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

        this.BigMap=new DaMap();
        this.Player=new Pole();
        this.addChild(this.BigMap);
        this.dayin(this.BigMap);
        
        
        this.addChild(this.Player);
        this.Player.x= this.Player.y=300;
        this.Player.Idle();
        this.touchEnabled=true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.Moveba,this);


/*        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        RES.getResAsync("description", this.startAnimation, this)
*/
    }

    private ZuobiaoZhuanHua(x:number):number{
        var k=0;
        k=Math.floor(x/this.BigMap.KuaiSize);
        return k;
    }

  

    private Moveba(evt:egret.TouchEvent):void {   
        var As=new Astar(this.BigMap,this.Player);
         As.jisuan(this.ZuobiaoZhuanHua(evt.stageX),this.ZuobiaoZhuanHua(evt.stageY));
         this.Player.Move(As.Ps);  
      //   console.log(evt.stageX+" "+evt.stageY);
       
    }
    private dayin(bm:DaMap):void {   
    var x="";
    var i=0,j=0,k=0;
    for(;j<bm.H;j++){
        x="";
        for(i=0;i<bm.W;i++) {
            if(bm.MapKs[k].canW==true)
                x=x+"口";
                else { x=x+"国";}
            k++;
        }
         console.log(x);
     }
       
    }







    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

   

    /**
     * 切换描述内容
     * Switch to described content
     */
    private changeDescription(textfield:egret.TextField, textFlow:Array<egret.ITextElement>):void {
        textfield.textFlow = textFlow;
    }
}

class FinishWalkEvent extends egret.Event
{
    public static FW:string = "走完";
//    public static isFw =false;
    public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false)
    {
        super(type,bubbles,cancelable);
    }
}



