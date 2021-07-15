<template>
   <!-- 机场详情 -->
    <Modal v-model="airportDetails_show" fullscreen footer-hide title="全国机场详情查阅" @on-cancel="close">
      <div style="display:flex;height:100%">
        <div class="airportDetails_left">
          <div style="margin-bottom:15px">
            <span>所属民航地方管理局</span>
            <Select v-model="administration" style="width:150px" @on-change="airportByBureau">
              <Option
                v-for="item in administration_list"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <Table
            :height="tableHeight"
            :columns="airportDetails_tableHeader"
            :data="airportDetails_tableData"
            @on-row-click="airportTxt"
          ></Table>
        </div>
        <div class="airportDetails_right">
          <table style="width:100%">
            <tr>
              <td style="width:16.66%">机场名称</td>
              <td style="width:16.66%">{{airportDetails.cn_name}}</td>
              <td style="width:16.66%">I COA代号</td>
              <td style="width:16.66%">{{airportDetails.ICAO}}</td>
              <td style="width:16.66%">IATA代号</td>
              <td style="width:16.66%">{{airportDetails.IATA}}</td>
            </tr>
            <tr>
              <td>机场性质</td>
              <td>{{airportDetails.using_type}}</td>
              <td>经纬度</td>
              <td>{{airportDetails.coordinate}}</td>
              <td>管理机构</td>
              <td>{{airportDetails.controller}}</td>
            </tr>
            <tr>
              <td>机场标高</td>
              <td>{{airportDetails.height}}</td>
              <td>建设年份</td>
              <td>{{airportDetails.built_year}}</td>
              <td>最长跑到长度</td>
              <td>{{airportDetails.val_long_rwy}}</td>
            </tr>
            <tr>
              <td>所属民航地区管理局</td>
              <td colspan="2">{{airportDetails.company}}</td>
              <td></td>
              <td></td>
              <td>
                <Button @click="clase(airportDetails)">展示机场位置</Button>
              </td>
            </tr>
          </table>
          <Tabs type="card" @on-click="tabClick">
            <TabPane label="机场手册">
              <p class="arrow" style="position:absolute;left:0;top:0;z-index: 1;">
                <span @click="changePdfPage(0)" class="turn" :class="{grey: currentPage==1}">上一页</span>
                {{currentPage}} / {{pageCount}}
                <span
                  @click="changePdfPage(1)"
                  class="turn"
                  :class="{grey: currentPage==pageCount}"
                >下一页</span>
              </p>
              <div
                class="pdf"
                :style="'height:'+(tableHeight-150)+'px;overflow:auto;position:relative'"
                v-show="fileType === 'pdf'"
              >
                <pdf
                  :src="src"
                  :page="currentPage"
                  @num-pages="pageCount=$event"
                  @page-loaded="currentPage=$event"
                  @loaded="loadPdfHandler"
                ></pdf>
              </div>
            </TabPane>
            <TabPane label="机场地面情况">
            <p class="arrow" style="position:absolute;left:0;top:0;z-index: 1;">
                <span @click="changePdfPage(0)" class="turn" :class="{grey: currentPage==1}">上一页</span>
                {{currentPage}} / {{pageCount}}
                <span
                  @click="changePdfPage(1)"
                  class="turn"
                  :class="{grey: currentPage==pageCount}"
                >下一页</span>
              </p>
              <div
                class="pdf"
                :style="'height:'+(tableHeight-150)+'px;overflow:auto;position:relative'"
                v-show="fileType === 'pdf'"
              >
                <pdf
                  :src="surfacesrc"
                  :page="currentPage"
                  @num-pages="pageCount=$event"
                  @page-loaded="currentPage=$event"
                  @loaded="loadPdfHandler"
                ></pdf>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Modal>  
</template>>
<script>
import pdf from "vue-pdf";
export default {
  components: {
    pdf,
  },
    data(){
        return{
            tableHeight:  window.innerHeight - 128,
            tableWidth: 1000,
            PDF_element_height: 400,
            airportDetails_show: false,
            administration: "",
            administration_list: [
                {
                label: "全部机场",
                value: "",
                },
                {
                label: "华东管理局",
                value: "华东管理局",
                },
                {
                label: "西北管理局",
                value: "西北管理局",
                },
                {
                label: "中南管理局",
                value: "中南管理局",
                },
                {
                label: "华北管理局",
                value: "华北管理局",
                },
                {
                label: "新疆管理局",
                value: "新疆管理局",
                },
                {
                label: "西南管理局",
                value: "西南管理局",
                },
                {
                label: "东北管理局",
                value: "东北管理局",
                },
            ],
            airportDetails_tableHeader: [
                {
                type: "index",
                width: 60,
                align: "center",
                },
                {
                title: "机场名称",
                key: "name",
                },
            ],
            airportDetails_tableData: [],
            airportDetails: {
                cn_name: "",
                ICAO: "",
                IATA: "",
                using_type: "",
                bulit_year: "",
                controller: "",
                company: "",
                coordinate: "",
                height: "",
                val_long_rwy: "",
            },
            airPortName:'',
            currentPage: 0, // pdf文件页码
            pageCount: 0, // pdf文件总页数
            fileType: "pdf", // 文件类型
            src: "", // pdf文件地址
            surfacesrc:'',
        }
    },
    methods:{
      close(){
        this.airportDetails_show = false;
      },
        showAirportDetails(data){
           this.airportDetails_show = !this.airportDetails_show;
           if(data){
             this.airportDetails = data;
             this.airPortName = data.cn_name;
             this.tabClick(0)
           }
           this.airportByBureau();
           
        },
        clase(item) {
            this.airportDetails_show = false;

            let str = item.coordinate.replace("N", "");
            let arr = str.split("E");
            var feature = turf.point([arr[1] / 10000, arr[0] / 10000], item);
            console.log(feature);
            let _features = [];
            _features.push(feature);
            this.map.addAirportDetails(
              (arr[1] / 10000),
                (arr[0] / 10000),
                 item,
                this
            );
        },
         //根据管理局返回管理局下机场
        airportByBureau() {
            let url = this.$urlPath.airplane.getAirportByBureau;
            let param = {
                bureau: this.administration,
            };
            let _this = this;
            this.$api.get(url, param).then((res) => {
                if (res.length > 0) {
                _this.administration_jc = [];
                _this.airportDetails_tableData = [];
                res.forEach((item) => {
                    let temp = {
                    name: item,
                    };
                    _this.airportDetails_tableData.push(temp);
                });
                }
            });
        },
        tabClick(item){
          if(item == 0){
            this.src =pdf.createLoadingTask( this.$urlPath.pdfmanurl+this.airPortName+".pdf");
          }else if(item ==1){
            this.surfacesrc =pdf.createLoadingTask( this.$urlPath.pdfsurfaceurl+this.airPortName+".pdf");
          }
          console.log(item)
        },
           //返回机场详细信息
        airportTxt(item, callback) {
            let url = this.$urlPath.airplane.getAirportTxt;
            let param = {
                airport: item.name || item.cn_name,
            };
            this.airPortName = param.airport;
            
            this.$api.get(url, param).then((res) => {
                if (res.length > 0) {
                this.airportDetails = res[0];
                this.tabClick(0)
                  if (typeof callback === "function") {
                      callback(res[0]);
                  }
                }
            });
        },
        //pdf
        changePdfPage(val) {
            // console.log(val)
            if (val === 0 && this.currentPage > 1) {
                this.currentPage--;
                // console.log(this.currentPage)
            }
            if (val === 1 && this.currentPage < this.pageCount) {
                this.currentPage++;
                // console.log(this.currentPage)
            }
        },

        // pdf加载时
        loadPdfHandler(e) {
            this.currentPage = 1; // 加载的时候先加载第一页
        },
    },
    created() {
        // 有时PDF文件地址会出现跨域的情况,这里最好处理一下
        //this.src = pdf.createLoadingTask(this.src);
    },
}
</script>

<style scoped>
.airportDetails_left {
  height: 100%;
  width: 270px;
}
.airportDetails_right {
  height: 100%;
  width: calc(100% - 270px);
  padding-left: 10px;
}
.airportDetails_right > table td {
  padding: 5px 2px;
}
#PDF_element {
  width: 100%;
}
</style>>