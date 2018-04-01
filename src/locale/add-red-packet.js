export default {
  messages: {
    en: {
      create_redpacket: 'Create Red Packet',
      choose_token: 'Choose Token',
      total_tokens_label: 'Total Tokens',
      message_label: 'DISPLAY MESSAGE',
      recipients_label: 'NUMBER of RECIPIENTS',
      from_cash: 'USE CASH',
      from_wallet: 'USE WALLET',
      card_text: 'If you choose "FROM WALLET", you need to make sure you have enough ETH in your wallet, because you have to pay GAS fee for the miners. If you choose "FROM CASH", you don\'t have to pay any GAS fee.',
      price_hint: '≈ {value} {currency}',
      token_left_suffex: '{value}{symbol} left',
      error: {
        create_red_packet_failed: 'Create Red Packet Failed',
        get_funds_failed: 'Get Tokens Failed',
        message_less_than_20: 'must be less than 20 characters',
        recipient_less_than_100: 'must be less than 100 recipients',
        number_required: 'must > 0',
        no_enough_gas: 'Sorry, you must have {amount}Gwei ETH in your wallet in minimum',
        no_enough_token: 'Sorry, you must have {amount} {token} token in your wallet in minimum',
        rp_need_gas_and_token: 'You don`t have enough cash, you need at least {gas}Ether ETH and {tokens}{symbol} in your wallet',
        rp_need_eth: 'You don`t have enough cash, you need at least {gas}Ether ETH in your wallet',
        too_small_number: 'Input number is too small',
        token_required: 'Please choose a token'
      }
    },
    zh_TW: {
      create_redpacket: '發紅包',
      choose_token: '選擇代幣',
      total_tokens_label: '代幣總數',
      message_label: '恭喜發財，大吉大利',
      recipients_label: '紅包個數',
      from_cash: '用零錢',
      from_wallet: '用錢包',
      card_text: '如果選擇【用錢包】，您需要確保錢包內有足夠的ETH用來支付轉帳所需的礦工費。如果選擇【用零錢】，您無須支付任何ETH給礦工。',
      price_hint: '≈ {value} {currency}',
      token_left_suffex: '剩餘{value}{symbol}',
      error: {
        create_red_packet_failed: '創建紅包失敗',
        get_funds_failed: '獲取代幣失敗',
        message_less_than_20: '必須少於20個字符',
        recipient_less_than_100: '必須少於 100',
        number_required: '必須大於0',
        no_enough_gas: '您的錢包至少需要 {amount}Gwei ETH',
        no_enough_token: '您的錢包至少需要 {amount} {token}',
        rp_need_gas_and_token: '您沒有足夠的零錢, 您需要在您的錢包裡至少有 {gas}Ether ETH 和 {tokens}{symbol}',
        rp_need_eth: '您沒有足夠的零錢, 您需要在您的錢包裡至少有 {gas}Ether ETH',
        too_small_number: '輸入數值太小了',
        token_required: '請選擇一種代幣'
      }
    },
    zh_CN: {
      create_redpacket: '发红包',
      choose_token: '选择代币',
      total_tokens_label: '代币总数',
      message_label: '恭喜发财，大吉大利',
      recipients_label: '红包个数',
      from_cash: '用零钱',
      from_wallet: '用钱包',
      card_text: '如果选择【用钱包】，您需要确保钱包内有足够的ETH用来支付转账所需矿工费。如果选择【用零钱】，您无须支付任何ETH给矿工。',
      price_hint: '≈ {value} {currency}',
      token_left_suffex: '剩余{value}{symbol}',
      error: {
        create_red_packet_failed: '创建红包失败',
        get_funds_failed: '获取代币失败',
        message_less_than_20: '必须少于20个字符',
        recipient_less_than_100: '必须少于 100',
        number_required: '必须大于0',
        no_enough_gas: '您的钱包至少需要 {amount}Gwei ETH',
        no_enough_token: '您的钱包至少需要 {amount} {token}',
        rp_need_gas_and_token: '您没有足够的零钱, 您需要在您的钱包里至少有 {gas}Ether ETH 和 {tokens}{symbol}',
        rp_need_eth: '您没有足够的零钱, 您需要在您的钱包里至少有 {gas}Ether ETH',
        too_small_number: '输入数值太小了',
        token_required: '请选择一种代币'
      }
    }
  }
}