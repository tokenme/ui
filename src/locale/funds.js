export default {
  messages: {
    en: {
      failed_title: 'GET FUNDS FAILED',
      main: 'MAIN ACCOUNT',
      export_private_key: 'export private key',
      from_cash: 'USE CASH',
      from_wallet: 'USE WALLET',
      form: {
        password: 'Password'
      },
      privatekey_response_title: 'Please keep it secret!',
      privatekey_response_msg: 'Click to copy',
      create_red_packet: 'Create Red Packet',
      transfer: 'Transfer Out',
      transfer_in: 'Transfer In',
      transfer_from_wallet: 'Deposit from Wallet',
      create_red_packet_title: 'Create {token} Red Packet',
      total_tokens_label: 'Total Tokens',
      message_label: 'DISPLAY MESSAGE',
      recipients_label: 'NUMBER of RECIPIENTS',
      cash: 'Cash',
      cash_balance_title: 'Cash Value',
      token_details: 'Token Details',
      price_hint: '≈ {value} {currency}',
      deposit_wait_tx_done: 'Please wait transaction complete!',
      transfering: 'Transfering',
      help: {
        redpacket: 'Choose and click one token in the list to create Red Packet',
        wallet_address: 'If you dosen\'t have enough token in your wallet, you could transfer the token to this wallet address, then you could send Red Packet through [Create Red Packet]->[FROM WALLET]->[choose a token]. (Click to copy the address)'
      },
      error: {
        deposit_failed: 'Deposit Failed',
        export_private_key_failed: 'Export Private Key Failed',
        create_red_packet_failed: 'Create Red Packet Failed',
        password_required: 'Password is required',
        message_less_than_20: 'must be less than 20 characters',
        recipient_less_than_100: 'must be less than 100 recipients',
        number_required: 'must > 0',
        no_enough_gas: 'Sorry, you must have {amount}Gwei ETH in your wallet in minimum',
        no_enough_token: 'Sorry, you must have {amount} {token} token in your wallet in minimum',
        rp_need_gas_and_token: 'You don`t have enough cash, you need at least {gas}Ether ETH and {tokens}{symbol} in your wallet',
        rp_need_eth: 'You don`t have enough cash, you need at least {gas}Ether ETH in your wallet',
        too_small_number: 'Input number is too small'
      }
    },
    zh_TW: {
      failed_title: '獲取資產失敗',
      main: '主錢包',
      export_private_key: '導出密鑰',
      from_cash: '用零錢',
      from_wallet: '用錢包',
      privatekey_response_title: '請確保密鑰安全！',
      privatekey_response_msg: '點擊複製',
      create_red_packet: '發紅包',
      transfer: '轉出',
      transfer_in: '轉入',
      transfer_from_wallet: '從主錢包充值',
      create_red_packet_title: '創建 {token} 紅包',
      total_tokens_label: '代幣總數',
      message_label: '恭喜發財，大吉大利',
      recipients_label: '紅包個數',
      cash: '零錢',
      cash_balance_title: '零錢價值',
      token_details: '代幣詳情',
      price_hint: '≈ {value} {currency}',
      deposit_wait_tx_done: '交易已提交，請等待轉賬完成！',
      transfering: '轉賬中',
      form: {
        password: '密碼'
      },
      help: {
        redpacket: '選擇並點擊下面列表中的代幣創建紅包',
        wallet_address: '如果您的錢包內還沒有代幣，您可以將相應的代幣和所需礦工費轉入該地址，之後就可以選擇【發紅包】->【用錢包】->選擇相應代幣發紅包了。(點擊複製錢包地址)'
      },
      error: {
        deposit_failed: '充值失敗',
        export_private_key_failed: '導出密鑰失敗',
        create_red_packet_failed: '創建紅包失敗',
        password_required: '請填寫密碼',
        message_less_than_20: '必須少於20個字符',
        recipient_less_than_100: '必須少於 100',
        number_required: '必須大於0',
        no_enough_gas: '您的錢包至少需要 {amount}Gwei ETH',
        no_enough_token: '您的錢包至少需要 {amount} {token}',
        rp_need_gas_and_token: '您沒有足夠的零錢, 您需要在您的錢包裡至少有 {gas}Ether ETH 和 {tokens}{symbol}',
        rp_need_eth: '您沒有足夠的零錢, 您需要在您的錢包裡至少有 {gas}Ether ETH',
        too_small_number: '輸入數值太小了'
      }
    },
    zh_CN: {
      failed_title: '获取资产失败',
      main: '主钱包',
      export_private_key: '导出密钥',
      from_cash: '用零钱',
      from_wallet: '用钱包',
      privatekey_response_title: '请确保密钥安全！',
      privatekey_response_msg: '点击复制',
      create_red_packet: '发红包',
      transfer: '转出',
      transfer_in: '转入',
      transfer_from_wallet: '从主钱包充值',
      create_red_packet_title: '创建 {token} 红包',
      total_tokens_label: '代币总数',
      message_label: '恭喜发财，大吉大利',
      recipients_label: '红包个数',
      cash: '零钱',
      cash_balance_title: '零钱价值',
      token_details: '代币详情',
      price_hint: '≈ {value} {currency}',
      deposit_wait_tx_done: '交易已提交，请等待转账完成！',
      transfering: '转账中',
      form: {
        password: '密码'
      },
      help: {
        redpacket: '选择并点击下面列表中的代币创建红包',
        wallet_address: '如果您的钱包内没有代币，可以将代币转入该地址，之后就可以选择【发红包】->【用钱包】->选择相应代币发红包了。(点击复制钱包地址)'
      },
      error: {
        deposit_failed: '充值失败',
        export_private_key_failed: '导出密钥失败',
        create_red_packet_failed: '创建红包失败',
        password_required: '请填写密码',
        message_less_than_20: '必须少于20个字符',
        recipient_less_than_100: '必须少于 100',
        number_required: '必须大于0',
        no_enough_gas: '您的钱包至少需要 {amount}Gwei ETH',
        no_enough_token: '您的钱包至少需要 {amount} {token}',
        rp_need_gas_and_token: '您没有足够的零钱, 您需要在您的钱包里至少有 {gas}Ether ETH 和 {tokens}{symbol}',
        rp_need_eth: '您没有足够的零钱, 您需要在您的钱包里至少有 {gas}Ether ETH',
        too_small_number: '输入数值太小了'
      }
    }
  }
}