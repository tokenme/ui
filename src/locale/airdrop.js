export default {
  messages: {
    en: {
      failed_title: 'GET AIRDROP FAILED',
      token_address: 'CONTRACT ADDRESS',
      token_name: 'NAME',
      token_symbol: 'SYMBOL',
      token_decimals: 'DECIMALS',
      wallet_address: 'DEPOSIT WALLET, click to copy',
      gas_balance: 'GAS BALANCE',
      token_balance: 'TOKEN BALANCE',
      bonus: 'BONUS: {bonus}%/tx',
      dateRange: 'From:{from} To:{to}',
      promote_btn: 'PROMOTE',
      withdraw: 'WITHDRAW',
      airdrop: {
        status: {
          stop: '暫停',
          start: '運行中'
        }
      },
      transfer_setting: 'TRANSFER SETTINGS',
      gas_price: 'GAS PRICE, click to edit',
      gas_limit: 'GAS LIMIT, click to edit',
      gas_price_label: 'GAS PRICE',
      suggest_gas_price_hint: 'Currently suggest gas price is {price}Gwei',
      max_submissions_label: 'MAX SUBMISSIONS',
      reply_msg_label: 'BOT REPLY MESSAGE',
      gas_limit_label: 'GAS LIMIT',
      drop_date_label: 'TRANSFER DATE',
      drop_date_sub_label: 'TRANSFER DATE, click to edit',
      give_out_label: 'GIVE OUT',
      symbol_per_user: '{symbol}/user',
      promotion_title: 'NEW PROMOTION',
      select_channel: 'SELECT CHANNEL',
      select_adzone: 'SELECT ADZONE',
      promotion_response_title: 'SUCCESSFULLY CREATED PROMOTION ACTIVITY',
      promotion_response_msg: 'Click to copy the promotion link',
      new_adzone_label: 'NEW ADZONE NAME',
      add_telegram_bot_alert: 'Please add @{bot} bot in @{group}',
      require_email_label: 'REQUIRE EMAIL',
      error: {
        get_adzones_failed: 'GET ADZONES FAILED',
        update_airdrop_failed: 'UPDATE AIRDROP FAILED',
        create_promotion_failed: 'CREATE PROMOTION FAILED',
        need_channel: 'Must select a channel',
        need_adzone: 'Must select a adzone',
        min_gas_price: 'min gas price >= 3Gwei',
        max_gas_price: 'max gas price <= 500Gwei',
        min_gas_limit: 'min gas limit >= 150000',
        number_required: 'must > 0',
        withdraw_failed: 'Withdraw Failed',
        withdraw_seperatly: 'Please transfer token or ether seperatly',
        wallet_required: 'Wallet address is required',
        wallet_invalid: 'Wallet address is invalid'
      },
      start_date_label: 'START DATE',
      end_date_label: 'END DATE',
      stats: {
        header: {
          record_on: 'Date',
          pv: 'PV',
          submissions: 'Submissions',
          transactions: 'Transactions',
          give_out: 'GiveOut',
          bonus: 'Bonus(Gwei)',
          commission_fee: 'CommissionFee(Gwei)'
        }
      },
      withdraw_form: {
        wallet_label: 'Wallet Address',
        token_amount_label: 'Token Amount',
        eth_amount_label: 'ETH Amount',
        gas_price_label: 'Gas Price',
        password: 'Password'
      },
      withdraw_tx_title: 'Withdraw Transaction',
      withdraw_tx_msg: 'Click to copy withdraw transaction tx address'
    },
    zh_TW: {
      failed_title: '獲取空投任務失敗',
      token_address: '代幣地址',
      token_name: '代幣名',
      token_symbol: '代幣符號',
      token_decimals: 'DECIMALS',
      wallet_address: '預算充值地址, 點擊複製',
      gas_balance: 'GAS 餘額',
      token_balance: '代幣餘額',
      bonus: '佣金: {bonus}%/tx',
      dateRange: '{from} 至 {to}',
      promote_btn: '推廣',
      withdraw: '提取餘額',
      airdrop: {
        status: {
          stop: '暫停',
          start: '運行中'
        }
      },
      transfer_setting: '轉賬設置',
      gas_price: 'GAS 出價, 點擊修改',
      gas_limit: 'GAS LIMIT, 點擊修改',
      gas_price_label: 'GAS 出價',
      suggest_gas_price_hint: '當前 Gas 建議出價為 {price}Gwei',
      gas_limit_label: 'GAS LIMIT',
      drop_date_label: '打幣時間',
      drop_date_sub_label: '打幣時間, 點擊修改',
      max_submissions_label: '最多提交人數',
      reply_msg_label: '電報機器人回復',
      give_out_label: '撒幣數',
      symbol_per_user: '{symbol}/用戶',
      promotion_title: '新建推廣計畫',
      select_channel: '選擇渠道',
      select_adzone: '選擇資源位',
      promotion_response_title: '成功創建推廣計畫',
      promotion_response_msg: '點擊複製推廣鏈接',
      new_adzone_label: '新資源位名',
      add_telegram_bot_alert: '請添加 @{bot} 機器人到群組 @{group}',
      require_email_label: '需要電子郵件',
      error: {
        get_adzones_failed: '獲取資源位失敗',
        update_airdrop_failed: '更新失敗',
        create_promotion_failed: '创建推广计划失败',
        need_channel: '請選擇渠道',
        need_adzone: '請選擇渠道',
        min_gas_price: '最小 Gas 出價 3Gwei',
        max_gas_price: '最大 Gas 出價 500Gwei',
        min_gas_limit: '最小 Gas Limit >= 150000',
        number_required: '必須大於0',
        withdraw_failed: '提取餘額失敗',
        withdraw_seperatly: '請分開轉賬代幣和ETH',
        wallet_required: '請填寫錢包地址',
        wallet_invalid: '錢包地址不正確'
      },
      start_date_label: '開始時間',
      end_date_label: '結束時間',
      stats: {
        header: {
          record_on: '日期',
          pv: '訪問量',
          submissions: '參與人數',
          transactions: '轉帳數',
          give_out: '送出代幣',
          bonus: '推廣獎勵(Gwei)',
          commission_fee: '平台佣金(Gwei)'
        }
      },
      withdraw_form: {
        wallet_label: '錢包地址',
        token_amount_label: '代幣數量',
        eth_amount_label: 'ETH數量',
        gas_price_label: 'Gas出價',
        password: '密碼'
      },
      withdraw_tx_title: '退款交易地址',
      withdraw_tx_msg: '點擊複製交易回執地址'
    },
    zh_CN: {
      failed_title: '获取空投任务失败',
      token_address: '代币地址',
      token_name: '代币名',
      token_symbol: '代币符号',
      token_decimals: 'DECIMALS',
      wallet_address: '预算充值地址, 点击复制',
      gas_balance: 'GAS 余额',
      token_balance: '代币余额',
      bonus: '佣金: {bonus}%/tx',
      dateRange: '{from} 至 {to}',
      promote_btn: '推广',
      withdraw: '提取余额',
      airdrop: {
        status: {
          stop: '暫停',
          start: '運行中'
        }
      },
      transfer_setting: '转账设置',
      gas_price: 'GAS 出价, 点击修改',
      gas_limit: 'GAS LIMIT, 点击修改',
      gas_price_label: 'GAS 出价',
      suggest_gas_price_hint: '当前 Gas 建议出价为 {price}Gwei',
      gas_limit_label: 'GAS LIMIT',
      give_out_label: '撒币数',
      drop_date_label: '打币时间',
      drop_date_sub_label: '打币时间, 点击修改',
      max_submissions_label: '最多提交人数',
      reply_msg_label: '电报机器人回复',
      symbol_per_user: '{symbol}/用户',
      promotion_title: '新建推广计划',
      select_channel: '选择渠道',
      select_adzone: '选择资源位',
      promotion_response_title: '成功创建推广计划',
      promotion_response_msg: '点击复制推广链接',
      new_adzone_label: '新资源位名',
      add_telegram_bot_alert: '请添加 @{bot} 机器人到群组 @{group}',
      require_email_label: '需要电子邮件',
      error: {
        get_adzones_failed: '获取资源位失败',
        update_airdrop_failed: '更新失败',
        create_promotion_failed: '创建推广计划失败',
        need_channel: '请选择渠道',
        need_adzone: '请选择资源位',
        min_gas_price: '最小 Gas 出价 3Gwei',
        max_gas_price: '最大 Gas 出价 500Gwei',
        min_gas_limit: '最小 Gas Limit >= 150000',
        number_required: '必须大于0',
        withdraw_seperatly: '请分开转账代币和ETH',
        wallet_required: '请填写钱包地址',
        wallet_invalid: '钱包地址不正确'
      },
      start_date_label: '开始时间',
      end_date_label: '结束时间',
      stats: {
        header: {
          record_on: '日期',
          pv: '访问量',
          submissions: '参与人数',
          transactions: '转账数',
          give_out: '送出代币',
          bonus: '推广奖励(Gwei)',
          commission_fee: '平台佣金(Gwei)'
        }
      },
      withdraw_form: {
        wallet_label: '钱包地址',
        token_amount_label: '代币数量',
        eth_amount_label: 'ETH数量',
        gas_price_label: 'Gas出价',
        password: '密码',
        withdraw_failed: '提取余额失败'
      },
      withdraw_tx_title: '退款交易地址',
      withdraw_tx_msg: '点击复制交易回执地址'
    }
  }
}