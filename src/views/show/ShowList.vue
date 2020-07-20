<template>
  <div class="HealthView">
    <div class="bbb" ref="barBox"></div>
  </div>
</template>

<script>
// 引入 ECharts 主模块
var echarts = require("echarts/lib/echarts");
// 引入饼图和柱状图
require("echarts/lib/chart/bar");
// 引入所需组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
// 引入请求数据
import { getBarInfo } from "network/showList";
export default {
  name: "HealthView",
  data() {
    return {
      // 饼图信息
      barInfo: []
    };
  },
  mounted() {
    // 绘制柱状图
    this.getBar();
  },
  methods: {
    async getBar() {
      // 获取并转化数据
      let res = await getBarInfo();
      // console.log(res)
      if (res.code === 200) {
        this.barInfo = res.data;
      } else {
        this.$message.error({
          message: "数据加载失败",
          center: true,
          showClose: true
        });
      }

      // 基于准备好的dom，初始化echarts实例
      var myChartBar = echarts.init(this.$refs.barBox);
      // 绘制图表
      myChartBar.setOption({
        grid: {
          x: 50,
          y: 80,
          x2: 60,
          y2: 50
        },
        title: {
          text: "点赞人数统计图",
          left: "center",
          top: 10
        },
        tooltip: {
          trigger: "axis",
          showContent: false,
          axisPointer: {
            type: "shadow"
          }
        },
        xAxis: {
          name: "(学院)",
          type: "category",
           data: ['软件学院', '艺术传媒', '会计学院', '经济管理', '信息技术']
        },
        yAxis: {
          name: "(人数)",
          type: "value"
        },
        series: [
          {
            data: this.barInfo,
            type: "bar",
            barWidth: 40,
            label: {
              show: true,
              position: [10, 10],
              color: "#fff"
            },
            itemStyle: {
              // 0,0,1,0表示从左向右    0,0,0,1表示从右向左
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0,
                  [
                    { offset: 1, color: "#c23531" },
                    { offset: 0, color: "#fff" }
                  ]
                )
              }
            }
          }
        ]
      });
    }
  }
};
</script>

<style scoped>
.HealthView {
  display: flex;
  justify-content: center;
  /* align-items: center; */
}
.bbb {
  width: 600px;
  height: 400px;
  padding: 10px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
}
</style>