// 产品报价系统主逻辑
class QuoteSystem {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.calculateAll();
    }

    // 初始化DOM元素
    initializeElements() {
        // 项目基本信息
        this.projectId = document.getElementById('projectId');
        this.projectName = document.getElementById('projectName');
        this.customerName = document.getElementById('customerName');

        // 硬成本计算
        this.personLevel = document.getElementById('personLevel');
        this.personCount = document.getElementById('personCount');
        this.personMonths = document.getElementById('personMonths');
        this.personCost = document.getElementById('personCost');

        this.rentPrice = document.getElementById('rentPrice');
        this.rentUnits = document.getElementById('rentUnits');
        this.rentMonths = document.getElementById('rentMonths');
        this.rentCost = document.getElementById('rentCost');

        this.allowancePrice = document.getElementById('allowancePrice');
        this.allowanceDays = document.getElementById('allowanceDays');
        this.allowanceCost = document.getElementById('allowanceCost');

        this.travelPrice = document.getElementById('travelPrice');
        this.travelMonths = document.getElementById('travelMonths');
        this.travelCost = document.getElementById('travelCost');

        this.hardCostTotal = document.getElementById('hardCostTotal');

        // 软成本计算
        this.pureCustomMonths = document.getElementById('pureCustomMonths');
        this.pureCustomPrice = document.getElementById('pureCustomPrice');
        this.semiCustomMonths = document.getElementById('semiCustomMonths');
        this.semiCustomPrice = document.getElementById('semiCustomPrice');
        this.reuseRatio = document.getElementById('reuseRatio');
        this.reuseRatioValue = document.getElementById('reuseRatioValue');
        this.softCostTotal = document.getElementById('softCostTotal');

        // 合同金额和利润结构
        this.constraintRatio = document.getElementById('constraintRatio');
        this.hardSoftTotal = document.getElementById('hardSoftTotal');
        this.contractAmount = document.getElementById('contractAmount');
        this.salesRatio = document.getElementById('salesRatio');
        this.platformFeeRatio = document.getElementById('platformFeeRatio');
        this.publicAreaRatio = document.getElementById('publicAreaRatio');
        this.taxRate = document.getElementById('taxRate');
        this.grossProfit = document.getElementById('grossProfit');

        // 按钮
        this.calculateBtn = document.getElementById('calculateBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.clearBtn = document.getElementById('clearBtn');

        // 图表
        this.profitChart = document.getElementById('profitChart');
        
        // 加载保存的自定义单价
        this.loadCustomPersonPrice();
        this.loadCustomRentPrice();
        this.loadCustomAllowancePrice();
        this.loadCustomTravelPrice();
        this.loadCustomPureCustomPrice();
        this.loadCustomSemiCustomPrice();
        this.loadSavedQuote();
    }

    // 加载保存的报价数据
    loadSavedQuote() {
        // 从localStorage加载保存的报价数据
        const savedQuotes = JSON.parse(localStorage.getItem('savedQuotes')) || [];
        
        // 如果有保存的报价数据，加载最新的一条
        if (savedQuotes.length > 0) {
            const latestQuote = savedQuotes[savedQuotes.length - 1];
            
            // 将数据填充到表单中
            this.projectId.value = latestQuote.projectId;
            this.projectName.value = latestQuote.projectName;
            this.customerName.value = latestQuote.customerName;
            this.personLevel.value = latestQuote.personLevel;
            this.personCount.value = latestQuote.personCount;
            this.personMonths.value = latestQuote.personMonths;
            this.personCost.value = latestQuote.personCost;
            this.rentPrice.value = latestQuote.rentPrice;
            this.rentUnits.value = latestQuote.rentUnits;
            this.rentMonths.value = latestQuote.rentMonths;
            this.rentCost.value = latestQuote.rentCost;
            this.allowancePrice.value = latestQuote.allowancePrice;
            this.allowanceDays.value = latestQuote.allowanceDays;
            this.allowanceCost.value = latestQuote.allowanceCost;
            this.travelPrice.value = latestQuote.travelPrice;
            this.travelMonths.value = latestQuote.travelMonths;
            this.travelCost.value = latestQuote.travelCost;
            this.hardCostTotal.value = latestQuote.hardCostTotal;
            this.pureCustomMonths.value = latestQuote.pureCustomMonths;
            this.pureCustomPrice.value = latestQuote.pureCustomPrice;
            this.semiCustomMonths.value = latestQuote.semiCustomMonths;
            this.semiCustomPrice.value = latestQuote.semiCustomPrice;
            this.reuseRatio.value = latestQuote.reuseRatio;
            this.softCostTotal.value = latestQuote.softCostTotal;
            this.constraintRatio.value = latestQuote.constraintRatio;
            this.hardSoftTotal.value = latestQuote.hardSoftTotal;
            this.contractAmount.value = latestQuote.contractAmount;
            this.salesRatio.value = latestQuote.salesRatio;
            this.platformFeeRatio.value = latestQuote.platformFeeRatio;
            this.publicAreaRatio.value = latestQuote.publicAreaRatio || 3;
            this.taxRate.value = latestQuote.taxRate;
            this.grossProfit.value = latestQuote.grossProfit;
            
            // 更新复用比例显示
            this.reuseRatioValue.textContent = `${latestQuote.reuseRatio}%`;
            
            // 更新利润结构可视化图表
            this.updateChart();
        }
    }

    // 绑定事件
    bindEvents() {
        // 所有输入字段变化时重新计算
        const inputs = document.querySelectorAll('input[type="number"], input[type="range"], select');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.calculateAll());
        });

        // 移除计算模式切换事件，因为现在同时显示两种计算方式
        
        // 复用比例滑块特殊处理
        this.reuseRatio.addEventListener('input', () => {
            this.reuseRatioValue.textContent = `${this.reuseRatio.value}%`;
            this.calculateAll();
        });

        // 按钮事件
        this.calculateBtn.addEventListener('click', () => this.calculateAll());
        this.exportBtn.addEventListener('click', () => this.exportToExcel());
        this.saveBtn.addEventListener('click', () => this.saveQuote());
        this.clearBtn.addEventListener('click', () => this.clearForm());

        // 项目编号自动生成
        this.generateProjectId();
        
        // 保存自定义人员单价到localStorage
        this.personLevel.addEventListener('input', () => this.saveCustomPersonPrice());
        // 保存自定义房租单价到localStorage
        this.rentPrice.addEventListener('input', () => this.saveCustomRentPrice());
        // 保存自定义补助单价到localStorage
        this.allowancePrice.addEventListener('input', () => this.saveCustomAllowancePrice());
        // 保存自定义差旅单价到localStorage
        this.travelPrice.addEventListener('input', () => this.saveCustomTravelPrice());
        // 保存自定义纯定制单价到localStorage
        this.pureCustomPrice.addEventListener('input', () => this.saveCustomPureCustomPrice());
        // 保存自定义半定制单价到localStorage
        this.semiCustomPrice.addEventListener('input', () => this.saveCustomSemiCustomPrice());
    }
    
    // 加载保存的自定义人员单价
    loadCustomPersonPrice() {
        const savedPrice = localStorage.getItem('customPersonPrice');
        if (savedPrice) {
            this.personLevel.value = savedPrice;
        }
    }
    
    // 保存自定义人员单价到localStorage
    saveCustomPersonPrice() {
        localStorage.setItem('customPersonPrice', this.personLevel.value);
    }

    // 加载保存的自定义房租单价
    loadCustomRentPrice() {
        const savedPrice = localStorage.getItem('customRentPrice');
        if (savedPrice) {
            this.rentPrice.value = savedPrice;
        }
    }

    // 保存自定义房租单价到localStorage
    saveCustomRentPrice() {
        localStorage.setItem('customRentPrice', this.rentPrice.value);
    }

    // 加载自定义补助单价
    loadCustomAllowancePrice() {
        const savedPrice = localStorage.getItem('customAllowancePrice');
        if (savedPrice) {
            this.allowancePrice.value = savedPrice;
        }
    }

    // 保存自定义补助单价到localStorage
    saveCustomAllowancePrice() {
        localStorage.setItem('customAllowancePrice', this.allowancePrice.value);
    }

    // 加载自定义差旅单价
    loadCustomTravelPrice() {
        const savedPrice = localStorage.getItem('customTravelPrice');
        if (savedPrice) {
            this.travelPrice.value = savedPrice;
        }
    }

    // 保存自定义差旅单价到localStorage
    saveCustomTravelPrice() {
        localStorage.setItem('customTravelPrice', this.travelPrice.value);
    }
    
    // 加载保存的自定义纯定制单价
    loadCustomPureCustomPrice() {
        const savedPrice = localStorage.getItem('customPureCustomPrice');
        if (savedPrice) {
            this.pureCustomPrice.value = savedPrice;
        }
    }
    
    // 保存自定义纯定制单价到localStorage
    saveCustomPureCustomPrice() {
        localStorage.setItem('customPureCustomPrice', this.pureCustomPrice.value);
    }
    
    // 加载保存的自定义半定制单价
    loadCustomSemiCustomPrice() {
        const savedPrice = localStorage.getItem('customSemiCustomPrice');
        if (savedPrice) {
            this.semiCustomPrice.value = savedPrice;
        }
    }
    
    // 保存自定义半定制单价到localStorage
    saveCustomSemiCustomPrice() {
        localStorage.setItem('customSemiCustomPrice', this.semiCustomPrice.value);
    }

    // 计算所有成本和金额
    calculateAll() {
        this.calculateHardCosts();
        this.calculateSoftCosts();
        this.calculateContractAmount();
        this.calculateGrossProfit();
        this.updateChart();
    }

    // 计算硬成本
    calculateHardCosts() {
        // 现场人员成本
        const personLevelValue = parseFloat(this.personLevel.value);
        const personCountValue = parseFloat(this.personCount.value) || 0;
        const personMonthsValue = parseFloat(this.personMonths.value) || 0;
        const personCostValue = personLevelValue * personCountValue * personMonthsValue;
        this.personCost.value = this.formatNumber(personCostValue);

        // 房租成本
        const rentPriceValue = parseFloat(this.rentPrice.value) || 0;
        const rentUnitsValue = parseFloat(this.rentUnits.value) || 0;
        const rentMonthsValue = parseFloat(this.rentMonths.value) || 0;
        const rentCostValue = rentPriceValue * rentUnitsValue * rentMonthsValue;
        this.rentCost.value = this.formatNumber(rentCostValue);

        // 补助成本
        const allowancePriceValue = parseFloat(this.allowancePrice.value) || 0;
        const allowanceDaysValue = parseFloat(this.allowanceDays.value) || 0;
        const personCount = parseFloat(this.personCount.value) || 0;
        const allowanceCostValue = allowancePriceValue * personCount * allowanceDaysValue;
        this.allowanceCost.value = this.formatNumber(allowanceCostValue);

        // 差旅成本
        const travelPriceValue = parseFloat(this.travelPrice.value) || 0;
        const travelMonthsValue = parseFloat(this.travelMonths.value) || 0;
        const travelCostValue = travelPriceValue * personCount * travelMonthsValue;
        this.travelCost.value = this.formatNumber(travelCostValue);

        // 硬成本小计
        const hardCostTotalValue = personCostValue + rentCostValue + allowanceCostValue + travelCostValue;
        this.hardCostTotal.value = this.formatNumber(hardCostTotalValue);

        return hardCostTotalValue;
    }

    // 计算软成本
    calculateSoftCosts() {
        let softCostTotalValue = 0;
        
        // 纯定制人月计算
        const pureCustomMonthsValue = parseFloat(this.pureCustomMonths.value) || 0;
        const pureCustomPriceValue = parseFloat(this.pureCustomPrice.value) || 0;
        const pureCustomCost = pureCustomMonthsValue * pureCustomPriceValue;
        
        // 半定制人月计算
        const semiCustomMonthsValue = parseFloat(this.semiCustomMonths.value) || 0;
        const semiCustomPriceValue = parseFloat(this.semiCustomPrice.value) || 0;
        const reuseRatioValue = parseInt(this.reuseRatio.value) / 100;
        const semiCustomCost = semiCustomMonthsValue * semiCustomPriceValue * (1 - reuseRatioValue);
        
        // 软成本总计 = 纯定制成本 + 半定制成本
        softCostTotalValue = pureCustomCost + semiCustomCost;
        
        this.softCostTotal.value = this.formatNumber(softCostTotalValue);
        return softCostTotalValue;
    }

    // 计算合同金额
    calculateContractAmount() {
        const hardCost = parseFloat(this.hardCostTotal.value) || 0;
        const softCost = parseFloat(this.softCostTotal.value) || 0;
        const constraintRatioValue = parseFloat(this.constraintRatio.value) / 100;

        const hardSoftTotalValue = hardCost + softCost;
        this.hardSoftTotal.value = this.formatNumber(hardSoftTotalValue);

        const contractAmountValue = hardSoftTotalValue / constraintRatioValue;
        this.contractAmount.value = this.formatNumber(contractAmountValue);

        return contractAmountValue;
    }

    // 计算毛利
    calculateGrossProfit() {
        const contractAmount = parseFloat(this.contractAmount.value) || 0;
        const hardSoftTotal = parseFloat(this.hardSoftTotal.value) || 0;
        const salesRatioValue = parseFloat(this.salesRatio.value) / 100;
        const platformFeeRatioValue = parseFloat(this.platformFeeRatio.value) / 100;
        const publicAreaRatioValue = parseFloat(this.publicAreaRatio.value) / 100;
        const taxRateValue = parseFloat(this.taxRate.value) / 100;

        // 计算各项费用
        const salesCost = contractAmount * salesRatioValue;
        const platformFee = contractAmount * platformFeeRatioValue;
        const publicAreaCost = contractAmount * publicAreaRatioValue;
        const tax = contractAmount * taxRateValue;

        // 毛利 = 合同金额 - 硬软成本合计 - 销售成本 - 平台费 - 公摊成本 - 税
        const grossProfitValue = contractAmount - hardSoftTotal - salesCost - platformFee - publicAreaCost - tax;
        
        this.grossProfit.value = this.formatNumber(grossProfitValue);
        return grossProfitValue;
    }

    // 更新利润结构可视化图表
    updateChart() {
        const contractAmount = parseFloat(this.contractAmount.value) || 0;
        const hardCost = parseFloat(this.hardCostTotal.value) || 0;
        const softCost = parseFloat(this.softCostTotal.value) || 0;
        const salesRatioValue = parseFloat(this.salesRatio.value) / 100;
        const platformFeeRatioValue = parseFloat(this.platformFeeRatio.value) / 100;
        const publicAreaRatioValue = parseFloat(this.publicAreaRatio.value) / 100;
        const taxRateValue = parseFloat(this.taxRate.value) / 100;

        // 计算各项成本
        const salesCost = contractAmount * salesRatioValue;
        const platformFee = contractAmount * platformFeeRatioValue;
        const publicAreaCost = contractAmount * publicAreaRatioValue;
        const tax = contractAmount * taxRateValue;
        const grossProfitValue = parseFloat(this.grossProfit.value) || 0;

        if (contractAmount === 0) {
            this.profitChart.innerHTML = '<p>请输入数据生成利润结构图表</p>';
            return;
        }

        const hardPercent = ((hardCost / contractAmount) * 100).toFixed(1);
        const softPercent = ((softCost / contractAmount) * 100).toFixed(1);
        const salesPercent = ((salesCost / contractAmount) * 100).toFixed(1);
        const platformPercent = ((platformFee / contractAmount) * 100).toFixed(1);
        const publicAreaPercent = ((publicAreaCost / contractAmount) * 100).toFixed(1);
        const taxPercent = ((tax / contractAmount) * 100).toFixed(1);
        const profitPercent = ((grossProfitValue / contractAmount) * 100).toFixed(1);

        this.profitChart.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 20px; height: 20px; background-color: #1890ff; border-radius: 4px;"></div>
                    <span>硬成本: ${hardPercent}%</span>
                    <div style="flex: 1; height: 10px; background-color: #e8e8e8; border-radius: 5px; overflow: hidden;">
                        <div style="height: 100%; width: ${hardPercent}%; background-color: #1890ff;"></div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 20px; height: 20px; background-color: #52c41a; border-radius: 4px;"></div>
                    <span>软成本: ${softPercent}%</span>
                    <div style="flex: 1; height: 10px; background-color: #e8e8e8; border-radius: 5px; overflow: hidden;">
                        <div style="height: 100%; width: ${softPercent}%; background-color: #52c41a;"></div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 20px; height: 20px; background-color: #faad14; border-radius: 4px;"></div>
                    <span>销售成本: ${salesPercent}%</span>
                    <div style="flex: 1; height: 10px; background-color: #e8e8e8; border-radius: 5px; overflow: hidden;">
                        <div style="height: 100%; width: ${salesPercent}%; background-color: #faad14;"></div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 20px; height: 20px; background-color: #f5222d; border-radius: 4px;"></div>
                    <span>平台费: ${platformPercent}%</span>
                    <div style="flex: 1; height: 10px; background-color: #e8e8e8; border-radius: 5px; overflow: hidden;">
                        <div style="height: 100%; width: ${platformPercent}%; background-color: #f5222d;"></div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 20px; height: 20px; background-color: #13c2c2; border-radius: 4px;"></div>
                    <span>公摊: ${publicAreaPercent}%</span>
                    <div style="flex: 1; height: 10px; background-color: #e8e8e8; border-radius: 5px; overflow: hidden;">
                        <div style="height: 100%; width: ${publicAreaPercent}%; background-color: #13c2c2;"></div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 20px; height: 20px; background-color: #722ed1; border-radius: 4px;"></div>
                    <span>税: ${taxPercent}%</span>
                    <div style="flex: 1; height: 10px; background-color: #e8e8e8; border-radius: 5px; overflow: hidden;">
                        <div style="height: 100%; width: ${taxPercent}%; background-color: #722ed1;"></div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 20px; height: 20px; background-color: #eb2f96; border-radius: 4px;"></div>
                    <span>毛利: ${profitPercent}%</span>
                    <div style="flex: 1; height: 10px; background-color: #e8e8e8; border-radius: 5px; overflow: hidden;">
                        <div style="height: 100%; width: ${profitPercent}%; background-color: #eb2f96;"></div>
                    </div>
                </div>
            </div>
        `;
    }

    // 生成项目编号
    generateProjectId() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const projectId = `PRJ-${year}${month}${day}-${random}`;
        this.projectId.value = projectId;
    }

    // 导出到Excel
    exportToExcel() {
        // 这里使用简单的CSV导出，实际项目中可以使用更复杂的Excel库
        const data = [
            ['项目信息', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['项目编号', this.projectId.value, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['项目名称', this.projectName.value, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['客户名称', this.customerName.value, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['硬成本', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['现场人员成本', this.personCost.value, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['房租成本', this.rentCost.value, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['补助成本', this.allowanceCost.value, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['差旅成本', this.travelCost.value, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['硬成本小计', this.hardCostTotal.value, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['软成本', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['纯定制人月', this.pureCustomMonths.value, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['纯定制单价', this.pureCustomPrice.value, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['半定制人月', this.semiCustomMonths.value, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['半定制单价', this.semiCustomPrice.value, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['产品复用比例', this.reuseRatio.value + '%', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['软成本小计', this.softCostTotal.value, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['合同金额和利润结构', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['约束比例', this.constraintRatio.value + '%', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['硬软成本合计', this.hardSoftTotal.value, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['合同金额 (含税)', this.contractAmount.value, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['销售比例', this.salesRatio.value + '%', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['平台费比例', this.platformFeeRatio.value + '%', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['公摊比例', this.publicAreaRatio.value + '%', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['税率', this.taxRate.value + '%', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['毛利', this.grossProfit.value, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
        ];

        const csvContent = 'data:text/csv;charset=utf-8,' + data.map(row => row.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `报价单_${this.projectId.value}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert('报价单已导出为CSV文件！');
    }

    // 保存报价
    saveQuote() {
        // 这里使用localStorage保存，实际项目中应该保存到服务器
        const quoteData = {
            projectId: this.projectId.value,
            projectName: this.projectName.value,
            customerName: this.customerName.value,
            personLevel: this.personLevel.value,
            personCount: this.personCount.value,
            personMonths: this.personMonths.value,
            personCost: this.personCost.value,
            rentPrice: this.rentPrice.value,
            rentUnits: this.rentUnits.value,
            rentMonths: this.rentMonths.value,
            rentCost: this.rentCost.value,
            allowancePrice: this.allowancePrice.value,
            allowanceDays: this.allowanceDays.value,
            allowanceCost: this.allowanceCost.value,
            travelPrice: this.travelPrice.value,
            travelMonths: this.travelMonths.value,
            travelCost: this.travelCost.value,
            hardCostTotal: this.hardCostTotal.value,
            pureCustomMonths: this.pureCustomMonths.value,
            pureCustomPrice: this.pureCustomPrice.value,
            semiCustomMonths: this.semiCustomMonths.value,
            semiCustomPrice: this.semiCustomPrice.value,
            reuseRatio: this.reuseRatio.value,
            softCostTotal: this.softCostTotal.value,
            constraintRatio: this.constraintRatio.value,
            hardSoftTotal: this.hardSoftTotal.value,
            contractAmount: this.contractAmount.value,
            salesRatio: this.salesRatio.value,
            platformFeeRatio: this.platformFeeRatio.value,
            publicAreaRatio: this.publicAreaRatio.value,
            taxRate: this.taxRate.value,
            grossProfit: this.grossProfit.value,
            createdAt: new Date().toISOString()
        };

        const savedQuotes = JSON.parse(localStorage.getItem('savedQuotes')) || [];
        savedQuotes.push(quoteData);
        localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));

        alert('报价已保存！');
    }

    // 清空表单
    clearForm() {
        if (confirm('确定要清空所有表单数据吗？')) {
            document.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
                if (!input.readOnly) {
                    if (input.id === 'personLevel') {
                        input.value = '20000'; // 保留默认人员单价
                        this.saveCustomPersonPrice();
                    } else if (input.id === 'rentPrice') {
                        input.value = '3000'; // 保留默认房租单价
                        this.saveCustomRentPrice();
                    } else if (input.id === 'allowancePrice') {
                        input.value = '60'; // 保留默认补助单价
                        this.saveCustomAllowancePrice();
                    } else if (input.id === 'travelPrice') {
                        input.value = '1200'; // 保留默认差旅单价
                        this.saveCustomTravelPrice();
                    } else if (input.id === 'personCount') {
                        input.value = '3'; // 保留默认人数
                    } else if (input.id === 'pureCustomMonths') {
                        input.value = '4';
                    } else if (input.id === 'pureCustomPrice') {
                        input.value = '20000';
                        this.saveCustomPureCustomPrice();
                    } else if (input.id === 'semiCustomMonths') {
                        input.value = '4';
                    } else if (input.id === 'semiCustomPrice') {
                        input.value = '15000';
                        this.saveCustomSemiCustomPrice();
                    } else {
                        input.value = '';
                    }
                }
            });

            // 重置下拉框和特殊字段的默认值
            this.reuseRatio.value = '25';
            this.reuseRatioValue.textContent = '25%';
            this.constraintRatio.value = '54';
            this.salesRatio.value = '8';
            this.platformFeeRatio.value = '5';
            this.publicAreaRatio.value = '3';
            this.taxRate.value = '3';

            // 重新计算
            this.generateProjectId();
            this.calculateAll();
        }
    }

    // 格式化数字
    formatNumber(num) {
        return num.toFixed(2);
    }
}

// 页面加载完成后初始化系统
document.addEventListener('DOMContentLoaded', () => {
    new QuoteSystem();
});