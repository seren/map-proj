var Colors = function(args) {
};

  // derived using: convert pollockShimmering.gif txt:- | sed -n 's/.*#\(......\) .*/'"'"'\1'"'"',/p' | sort > pollock-rgb.txt
Colors.prototype.colors = {
    pollockShimmering: ['001000','001000','001000','001000','001000','001000','001000','001000','100000','100000','100000','100000','100000','100000','100000','100000','102028','102028','102028','102028','102028','302008','302008','302008','302008','302008','302008','302008','302008','302008','302008','302008','382810','382810','382810','382810','382810','382810','382810','382810','382810','382810','383828','383828','383828','383828','383828','383828','383828','383828','383828','383828','384030','384030','384030','384030','484858','484858','484858','484858','484858','484858','484858','484858','484858','501000','501000','501000','501000','501000','501000','501000','501000','501000','501000','501000','505860','505860','505860','505860','505860','505860','505860','505860','505860','582800','582800','582800','582800','582800','582800','582800','582800','585048','585048','585048','585048','585048','585048','585048','585048','585048','585048','585838','585838','585838','585838','585838','585838','585838','585838','585838','585838','586858','586858','586858','586858','586858','586858','586858','586858','586858','586858','586868','586868','586868','586868','586868','586868','586868','586868','586868','586868','603810','603810','603810','603810','603810','603810','603810','603810','603810','603810','607070','607070','607070','607070','607070','607070','607070','607070','607070','607070','685858','685858','685858','685858','685858','685858','685858','685858','685858','685858','686870','686870','686870','686870','686870','686870','686870','686870','686870','687078','687078','687078','687078','687078','687078','687078','687078','708080','708080','708080','708080','708080','708080','708080','708080','708080','708080','787880','787880','787880','787880','787880','787880','787880','787880','787880','787880','787880','787880','805800','805800','805800','805800','805800','805800','805800','805800','805800','805800','905048','905048','905048','905048','905048','905048','905048','905048','905048','905048','905048','905048','905818','905818','905818','905818','905818','905818','905818','905818','905818','905818','906070','906070','906070','906070','906070','906070','906070','906070','906070','906070','906848','906848','906848','906848','906848','906848','906848','906848','906848','906848','983010','983010','983010','983010','983010','983010','983010','983010','983010','983010','983010','983010','984008','984008','984008','984008','984008','984008','984008','984008','984008','984008','986870','986870','986870','986870','986870','98A0B8','98A0B8','98A0B8','98A0B8','98A0B8','98A0B8','98A0B8','98A0B8','98A0B8','98A0B8','A03810','A03810','A03810','A03810','A03810','A03810','A03810','A03810','A03810','A05810','A05810','A05810','A05810','A05810','A05810','A05810','A05810','A05810','A05810','A05810','A05810','A07078','A07078','A07078','A07078','A07078','A07078','A07078','A07078','A07078','A07078','A07800','A07800','A07800','A07800','A07800','A07800','A07800','A07800','A07800','A07800','A07848','A07848','A07848','A07848','A07848','A07848','A07848','A07848','A07848','A08078','A08078','A08078','A08078','A08078','A08078','A08078','A08078','A08078','A08078','A08078','A08078','A09078','A09078','A09078','A09078','A09078','A09078','A09078','A09078','A09078','A09078','A0A0A8','A0A0A8','A0A0A8','A0A0A8','A0A0A8','A0A0A8','A82818','A82818','A82818','A82818','A82818','A82818','A82818','A82818','A89070','A89070','A89070','A89070','A89070','A89070','A89070','A89070','A89070','A89070','A89848','A89848','A89848','A89848','A89848','A89848','A89848','A89848','A89848','A89848','A89868','A89868','A89868','A89868','A89868','A89868','A89868','A89868','A89868','A89868','A89868','A89868','A8A078','A8A078','A8A078','A8A078','A8A078','A8A078','A8A078','A8A078','A8A078','A8A078','A8A880','A8A880','A8A880','A8A880','A8A880','A8A880','A8A880','A8A880','A8A880','A8A880','A8B0A0','A8B0A0','A8B0A0','A8B0A0','A8B0A0','A8B0A0','A8B0A0','A8B0A0','A8B0A0','A8B0A0','A8B0A0','A8B0A0','A8B0A0','A8B0A0','A8B0A0','B08868','B08868','B08868','B08868','B08868','B08868','B08868','B08868','B08868','B08868','B09020','B09020','B09020','B09020','B09020','B09020','B09020','B09020','B09020','B09020','B09030','B09030','B09030','B09030','B09030','B09030','B09030','B09030','B09030','B09030','B0A098','B0A098','B0A098','B0A098','B0A098','B0A098','B0A098','B0A098','B0A098','B0A098','B0A870','B0A870','B0A870','B0A870','B0A870','B0A870','B0A870','B0A870','B0A870','B0A870','B0A890','B0A890','B0A890','B0A890','B0A890','B0A890','B0A890','B0A890','B0A890','B0A890','B0A890','B0A890','B0B078','B0B078','B0B078','B0B078','B0B078','B0B078','B0B078','B0B078','B0B078','B0B078','B0B098','B0B098','B0B098','B0B098','B0B098','B0B098','B0B098','B0B098','B0B098','B0B098','B0B8B0','B0B8B0','B0B8B0','B0B8B0','B0B8B0','B0B8B0','B0B8B0','B0B8B0','B0B8B0','B0C0B8','B0C0B8','B0C0B8','B0C0B8','B0C0B8','B0C0B8','B0C0B8','B0C0B8','B88868','B88868','B88868','B88868','B88868','B88868','B88868','B88868','B88868','B88868','B8B8A8','B8B8A8','B8B8A8','B8B8A8','B8B8A8','B8B8A8','B8B8A8','B8B8A8','B8B8A8','B8B8A8','B8B8B0','B8B8B0','B8B8B0','B8B8B0','B8B8B0','B8B8B0','B8B8B0','B8B8B0','B8B8B0','B8B8B0','C09888','C09888','C09888','C09888','C09888','C09888','C09888','C09888','C09888','C09888','C0A060','C0A060','C0A060','C0A060','C0A060','C0A060','C0A060','C0A060','C0A060','C0A060','C0B078','C0B078','C0B078','C0B078','C0B078','C0B078','C0B078','C0B078','C0B078','C0B078','C0B090','C0B090','C0B090','C0B090','C0B090','C0B090','C0B090','C0B090','C0B090','C0B090','C0C090','C0C090','C0C090','C0C090','C0C090','C0C090','C0C090','C0C090','C0C090','C0C090','C0C0B0','C0C0B0','C0C0B0','C0C0B0','C0C0B0','C0C0B0','C0C0B0','C0C0B0','C0C0B0','C0C0B0','C0C0B0','C8A078','C8A078','C8A078','C8A078','C8A078','C8A078','C8B060','C8B060','C8B060','C8B060','C8B060','C8B060','C8B060','C8B060','C8B060','C8B060','C8B060','C8B060','C8B078','C8B078','C8B078','C8B078','C8B078','C8B078','C8B078','C8B078','C8B078','C8B078','C8B8A0','C8B8A0','C8B8A0','C8B8A0','C8B8A0','C8B8A0','C8B8A0','C8B8A0','C8B8A0','C8B8A0','C8B8A0','C8B8A0','C8C098','C8C098','C8C098','C8C098','C8C098','C8C098','C8C098','C8C098','C8C098','C8C098','C8C8B8','C8C8B8','C8C8B8','C8C8B8','C8C8B8','D0B078','D0B078','D0B078','D0B078','D0B078','D0B078','D0B078','D0B078','D0B078','D0B078','D0B080','D0B080','D0B080','D0B080','D0B080','D0B080','D0B080','D0B080','D0B080','D0B080','D0B0B0','D0B0B0','D0B0B0','D0B0B0','D0B0B0','D0B0B0','D0B0B0','D0B0B0','D0B0B0','D0B0B0','D0B890','D0B890','D0B890','D0B890','D0B890','D0B890','D0B890','D0B890','D0B890','D0B890','D0B890','D0B890','D0B890','D0B890','D0B890','D0B890','D0B890','D0B890','D0B890','D0B890','D0C058','D0C058','D0C058','D0C058','D0C058','D0C058','D0C058','D0C058','D0C058','D0C058','D0C0A0','D0C0A0','D0C0A0','D0C0A0','D0C0A0','D0C0A0','D0C0A0','D0C0A0','D0C0A0','D0C0A0','D0C8A0','D0C8A0','D0C8A0','D0C8A0','D0C8A0','D0C8A0','D0C8A0','D0C8A0','D0C8A0','D0C8A0','D0C8A8','D0C8A8','D0C8A8','D0C8A8','D0C8A8','D0C8A8','D0C8A8','D0C8A8','D0C8B0','D0C8B0','D0C8B0','D0C8B0','D0C8B0','D0C8B0','D0C8B0','D0C8B0','D0C8B0','D0C8B0','D0C8B0','D0C8B0','D0C8B0','D0C8B0','D0C8B0','D0C8B0','D0D0C0','D0D0C0','D0D0C0','D0D0C0','D0D0C0','D0D0C0','D0D0C0','D0D0C0','D0D0C0','D0D0C0','D0D0C0','D0D0C0','D0D0C0','D0D0C0','D0D0C0','D0D0C0','D0D0C0','D0D0C0','D0D0C0','D0D0C0','D8C070','D8C070','D8C070','D8C070','D8C070','D8C070','D8C070','D8C070','D8C070','D8C070','D8C088','D8C088','D8C088','D8C088','D8C088','D8C088','D8C088','D8C088','D8C088','D8C088','D8C0A0','D8C0A0','D8C0A0','D8C0A0','D8C0A0','D8C0A0','D8C0A0','D8C0A0','D8C0A0','D8C0A0','D8C0A8','D8C0A8','D8C0A8','D8C0A8','D8C0A8','D8C0A8','D8C0A8','D8C0A8','D8C0B0','D8C0B0','D8C0B0','D8C0B0','D8C0B0','D8C0B0','D8C0B0','D8C0B0','D8C0B0','D8C0B0','D8C0B0','D8C0B0','D8C898','D8C898','D8C898','D8C898','D8C898','D8C898','D8C898','D8C898','D8C898','D8C898','D8C8A0','D8C8A0','D8C8A0','D8C8A0','D8C8A0','D8C8A0','D8C8A0','D8C8A0','D8C8A0','D8C8A0','D8C8A0','D8C8B0','D8C8B0','D8C8B0','D8C8B0','D8C8B0','D8C8B0','D8C8B0','D8C8B0','D8C8B0','D8D0B0','D8D0B0','D8D0B0','D8D0B0','D8D0B0','D8D0B0','D8D0B0','D8D0B0','D8D0B0','D8D0B0','D8D0B0','D8D0B0','D8D0B0','D8D0B0','D8D0B0','D8D0B0','D8D0B0','D8D0B0','D8D0B0','D8D0B0','E0A060','E0A060','E0A060','E0A060','E0A060','E0A060','E0A060','E0A060','E0A060','E0A060','E0B080','E0B080','E0B080','E0B080','E0B080','E0B080','E0B080','E0B080','E0B080','E0B080','E0B850','E0B850','E0B850','E0B850','E0B850','E0B850','E0B850','E0B850','E0B850','E0B850','E0B850','E0B850','E0C858','E0C858','E0C858','E0C858','E0C858','E0C858','E0C858','E0C858','E0C858','E0C858','E0C8A0','E0C8A0','E0C8A0','E0C8A0','E0C8A0','E0C8A0','E0C8A0','E0C8A0','E0C8A0','E0C8A0','E0C8A8','E0C8A8','E0C8A8','E0C8A8','E0C8A8','E0C8A8','E0C8A8','E0C8A8','E0C8A8','E0C8A8','E0D098','E0D098','E0D098','E0D098','E0D098','E0D098','E0D098','E0D098','E0D098','E0D098','E0D098','E0D098','E0D098','E0D098','E0D098','E0D098','E0D098','E0D098','E0D098','E0D098','E0D098','E0D098','E0D0A0','E0D0A0','E0D0A0','E0D0A0','E0D0A0','E0D0A0','E0D0A0','E0D0A0','E0D0A0','E0D0A0','E0D0B0','E0D0B0','E0D0B0','E0D0B0','E0D0B0','E0D0B0','E0D0B0','E0D0B0','E0D0B0','E0D0B0','E0D0B0','E0D0B0','E0D0B0','E0D0B0','E0D0B0','E0D0B0','E0D0B0','E0D0B0','E0D0B0','E0D0B0','E0D0B0','E0D8A0','E0D8A0','E0D8A0','E0D8A0','E0D8A0','E0D8B0','E0D8B0','E0D8B0','E0D8B0','E0D8B0','E0D8B0','E0D8B0','E0D8B0','E0D8B0','E0D8B0','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0D8B8','E0E0B0','E0E0B0','E0E0B0','E0E0B0','E0E0B0','E0E0B0','E0E0B0','E0E0B0','E0E0B0','E0E0B0','E0E0B8','E0E0B8','E0E0B8','E0E0B8','E0E0B8','E0E0B8','E0E0B8','E0E0B8','E0E0B8','E0E0B8','E0E0C0','E0E0C0','E0E0C0','E0E0C0','E0E0C0','E0E0C0','E0E0C0','E0E0C0','E0E0C0','E0E0C0','E8B828','E8B828','E8B828','E8B828','E8B828','E8B828','E8B828','E8B828','E8B828','E8B828','E8B878','E8B878','E8B878','E8B878','E8B878','E8B878','E8B878','E8B878','E8B878','E8B878','E8C078','E8C078','E8C078','E8C078','E8C078','E8C078','E8C078','E8C078','E8C078','E8C088','E8C088','E8C088','E8C088','E8C088','E8C088','E8C088','E8C088','E8C088','E8C088','E8C088','E8C088','E8C848','E8C848','E8C848','E8C848','E8C848','E8C848','E8C848','E8C848','E8C848','E8C848','E8C880','E8C880','E8C880','E8C880','E8C880','E8C880','E8C880','E8C880','E8C880','E8C898','E8C898','E8C898','E8C898','E8C898','E8C898','E8C898','E8C898','E8C898','E8C898','E8C898','E8C898','E8C898','E8C898','E8C898','E8C898','E8C898','E8C898','E8C898','E8C898','E8D050','E8D050','E8D050','E8D050','E8D050','E8D050','E8D050','E8D050','E8D078','E8D078','E8D078','E8D078','E8D078','E8D078','E8D078','E8D078','E8D078','E8D078','E8D078','E8D078','E8D8A8','E8D8A8','E8D8A8','E8D8A8','E8D8A8','E8D8A8','E8D8A8','E8D8A8','E8D8C0','E8D8C0','E8D8C0','E8D8C0','E8D8C0','E8D8C0','E8D8C0','E8D8C0','E8D8C0','E8D8C0','E8D8C0','E8D8C0','E8D8C8','E8D8C8','E8D8C8','E8D8C8','E8D8C8','E8D8C8','E8D8C8','E8D8C8','E8D8C8','E8D8C8','E8E080','E8E080','E8E080','E8E080','E8E080','E8E080','E8E080','E8E080','E8E080','E8E080','E8E098','E8E098','E8E098','E8E098','E8E098','E8E098','E8E098','E8E098','E8E098','E8E098','E8E0B0','E8E0B0','E8E0B0','E8E0B0','E8E0B0','E8E0B0','E8E0B0','E8E0B0','E8E0B0','E8E0B0','E8E0B0','E8E0B0','E8E0B0','E8E0C8','E8E0C8','E8E0C8','E8E0C8','E8E0C8','E8E0C8','E8E0C8','E8E0C8','E8E0C8','E8E0C8','E8E8D8','E8E8D8','E8E8D8','E8E8D8','E8E8D8','E8E8D8','E8E8D8','E8E8D8','E8E8D8','E8E8D8','E8F0C0','E8F0C0','E8F0C0','E8F0C0','E8F0C0','E8F0C0','E8F0C0','E8F0C0','E8F0C0','E8F0C0','E8F0D8','E8F0D8','E8F0D8','E8F0D8','E8F0D8','E8F0D8','E8F0D8','E8F0D8','E8F0E0','E8F0E0','E8F0E0','E8F0E0','E8F0E0','E8F0E0','E8F0E0','E8F0E0','F0C868','F0C868','F0C868','F0C868','F0C868','F0C868','F0C868','F0C868','F0C868','F0C868','F0C898','F0C898','F0C898','F0C898','F0C898','F0C898','F0C898','F0C898','F0C898','F0C898','F0D098','F0D098','F0D098','F0D098','F0D098','F0D098','F0D098','F0D098','F0D098','F0D098','F0D870','F0D870','F0D870','F0D870','F0D870','F0D870','F0D870','F0D870','F0D890','F0D890','F0D890','F0D890','F0D890','F0D890','F0D890','F0D890','F0D890','F0D890','F0D890','F0D890','F0D898','F0D898','F0D898','F0D898','F0D898','F0D898','F0D898','F0D898','F0D898','F0D898','F0D898','F0D898','F0D898','F0D898','F0D898','F0D898','F0D898','F0D898','F0D8C0','F0D8C0','F0D8C0','F0D8C0','F0D8C0','F0D8C0','F0D8C0','F0D8C0','F0D8C0','F0D8C0','F0D8D0','F0D8D0','F0D8D0','F0D8D0','F0D8D0','F0D8D0','F0D8D0','F0D8D0','F0D8D0','F0D8D0','F0E080','F0E080','F0E080','F0E080','F0E080','F0E080','F0E080','F0E080','F0E080','F0E080','F0E0B0','F0E0B0','F0E0B0','F0E0B0','F0E0B0','F0E0B0','F0E0B0','F0E0B0','F0E0B0','F0E0B0','F0E0B0','F0E0B0','F0E0B0','F0E0B0','F0E0B0','F0E0B0','F0E0B0','F0E0B0','F0E0B8','F0E0B8','F0E0B8','F0E0B8','F0E0B8','F0E0B8','F0E0B8','F0E0B8','F0E0B8','F0E0B8','F0E0B8','F0E0B8','F0E0B8','F0E0B8','F0E0B8','F0E0B8','F0E0B8','F0E0B8','F0E0B8','F0E0B8','F0E0C0','F0E0C0','F0E0C0','F0E0C0','F0E0C0','F0E0C0','F0E0C0','F0E0C0','F0E0C0','F0E0C0','F0E0C0','F0E0C0','F0E0C0','F0E0C0','F0E0C0','F0E0C0','F0E0C0','F0E0C0','F0E0C0','F0E0C0','F0E8A0','F0E8A0','F0E8A0','F0E8A0','F0E8A0','F0E8B8','F0E8B8','F0E8B8','F0E8B8','F0E8B8','F0E8B8','F0E8B8','F0E8B8','F0E8B8','F0E8B8','F0E8B8','F0E8B8','F0E8B8','F0E8B8','F0E8B8','F0E8B8','F0E8C0','F0E8C0','F0E8C0','F0E8C0','F0E8C0','F0E8C0','F0E8C0','F0E8C0','F0E8C0','F0E8C0','F0E8C0','F0E8C0','F0E8C0','F0E8C0','F0E8C0','F0E8C0','F0E8C0','F0E8C0','F0E8C0','F0E8C0','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8C8','F0E8D0','F0E8D0','F0E8D0','F0E8D0','F0E8D0','F0E8D0','F0E8D0','F0E8D0','F0E8D8','F0E8D8','F0E8D8','F0E8D8','F0E8D8','F0E8D8','F0E8D8','F0E8D8','F0E8D8','F0E8D8','F0E8D8','F0E8D8','F0E8D8','F0E8D8','F0E8D8','F0E8D8','F0E8D8','F0E8D8','F0F0C0','F0F0C0','F0F0C0','F0F0C0','F0F0C0','F0F0C0','F0F0C0','F0F0C0','F0F0C0','F0F0C8','F0F0C8','F0F0C8','F0F0C8','F0F0C8','F0F0C8','F0F0C8','F0F0C8','F0F0C8','F0F0C8','F0F0D0','F0F0D0','F0F0D0','F0F0D0','F0F0D0','F0F0D0','F0F0D0','F0F0D0','F0F0D0','F0F0D0','F0F0E0','F0F0E0','F0F0E0','F0F0E0','F0F0E0','F0F0E0','F0F0E0','F0F0E0','F0F0E0','F0F0E0','F0F0E0','F0F0E0','F0F0E0','F0F0E0','F0F0E0','F0F0E0','F0F0E0','F0F0E0','F0F0E0','F0F0E0','F0F0E0','F0F0E0','F0F8A8','F0F8A8','F0F8A8','F0F8A8','F0F8A8','F0F8A8','F0F8A8','F8B828','F8B828','F8B828','F8B828','F8B828','F8B828','F8B888','F8B888','F8B888','F8B888','F8B888','F8B888','F8B888','F8B888','F8B888','F8B888','F8B888','F8B888','F8E050','F8E050','F8E050','F8E050','F8E050','F8E050','F8E050','F8E050','F8E050','F8E050','F8E070','F8E070','F8E070','F8E070','F8E070','F8E070','F8E070','F8E070','F8E070','F8E070','F8E0A0','F8E0A0','F8E0A0','F8E0A0','F8E0A0','F8E0A0','F8E0A0','F8E0A0','F8E0A0','F8E0A0','F8E0A0','F8E0A0','F8E0A8','F8E0A8','F8E0A8','F8E0A8','F8E0A8','F8E0A8','F8E0A8','F8E0A8','F8E0A8','F8E0A8','F8E0A8','F8E0A8','F8E0B0','F8E0B0','F8E0B0','F8E0B0','F8E0B0','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0B8','F8E0C0','F8E0C0','F8E0C0','F8E0C0','F8E0C0','F8E0C0','F8E0C0','F8E0C0','F8E0C0','F8E0C0','F8E0C0','F8E0C0','F8E0C0','F8E0C0','F8E0C0','F8E0C0','F8E0C0','F8E0C0','F8E0C0','F8E0C0','F8E0D8','F8E0D8','F8E0D8','F8E0D8','F8E0D8','F8E0D8','F8E0D8','F8E0D8','F8E0D8','F8E0D8','F8E878','F8E878','F8E878','F8E878','F8E878','F8E878','F8E878','F8E878','F8E878','F8E878','F8E8B8','F8E8B8','F8E8B8','F8E8B8','F8E8B8','F8E8B8','F8E8B8','F8E8B8','F8E8B8','F8E8B8','F8E8C0','F8E8C0','F8E8C0','F8E8C0','F8E8C0','F8E8C0','F8E8C0','F8E8C0','F8E8C0','F8E8C0','F8E8D0','F8E8D0','F8E8D0','F8E8D0','F8E8D0','F8E8D0','F8E8D0','F8E8D0','F8E8E0','F8E8E0','F8E8E0','F8E8E0','F8E8E0','F8E8E0','F8E8E0','F8E8E0','F8E8E0','F8E8E0','F8F0B8','F8F0B8','F8F0B8','F8F0B8','F8F0B8','F8F0B8','F8F0B8','F8F0B8','F8F0B8','F8F0B8','F8F0B8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0C8','F8F0D0','F8F0D0','F8F0D0','F8F0D0','F8F0D0','F8F0D0','F8F0D0','F8F0D0','F8F0D0','F8F0D0','F8F0D8','F8F0D8','F8F0D8','F8F0D8','F8F0D8','F8F0D8','F8F0D8','F8F0D8','F8F0D8','F8F0D8','F8F8D0','F8F8D0','F8F8D0','F8F8D0','F8F8D0','F8F8D0','F8F8D0','F8F8D0','F8F8D0','F8F8D0','F8F8D0','F8F8D0','F8F8D0','F8F8D0','F8F8D0','F8F8D0','F8F8D0','F8F8D0','F8F8D0','F8F8D0','F8F8F8','F8F8F8','F8F8F8','F8F8F8','F8F8F8','F8F8F8','F8F8F8','F8F8F8','F8F8F8','F8F8F8','FF9828','FF9828','FF9828','FF9828','FF9828','FF9828','FF9828','FF9828','FF9828','FF9828','FFC828','FFC828','FFC828','FFC828','FFC828','FFD028','FFD028','FFD028','FFD028','FFD028','FFD028','FFD028','FFD028','FFD028','FFD028','FFD070','FFD070','FFD070','FFD070','FFD070','FFD070','FFD0B8','FFD0B8','FFD0B8','FFD0B8','FFD0B8','FFD0B8','FFD0B8','FFD0B8','FFD0B8','FFD0B8','FFD0B8','FFD0B8','FFD8A0','FFD8A0','FFD8A0','FFD8A0','FFD8A0','FFD8A0','FFD8A0','FFD8A0','FFD8A0','FFD8A0','FFD8A0','FFD8A0','FFD8A8','FFD8A8','FFD8A8','FFD8A8','FFD8A8','FFD8A8','FFD8A8','FFD8A8','FFD8A8','FFD8A8','FFD8A8','FFD8A8','FFD8B0','FFD8B0','FFD8B0','FFD8B0','FFD8B0','FFD8B0','FFD8B0','FFD8B0','FFD8B0','FFD8B0','FFE078','FFE078','FFE078','FFE078','FFE078','FFE078','FFE078','FFE078','FFE078','FFE078','FFE868','FFE868','FFE868','FFE868','FFE868','FFE868','FFE868','FFE868','FFE868','FFE868','FFE878','FFE878','FFE878','FFE878','FFE878','FFE878','FFE878','FFE878','FFE878','FFE878','FFE890','FFE890','FFE890','FFE890','FFE890','FFE890','FFE890','FFE890','FFE890','FFE890','FFE898','FFE898','FFE898','FFE898','FFE898','FFE898','FFE898','FFE898','FFE898','FFE898','FFE898','FFE898','FFE898','FFE898','FFE898','FFE898','FFE898','FFE898','FFE8B0','FFE8B0','FFE8B0','FFE8B0','FFE8B0','FFE8B0','FFE8B0','FFE8B0','FFE8B0','FFE8B0','FFE8B8','FFE8B8','FFE8B8','FFE8B8','FFE8B8','FFE8B8','FFE8B8','FFE8B8','FFE8B8','FFE8B8','FFE8B8','FFE8B8','FFE8B8','FFE8B8','FFE8B8','FFE8B8','FFE8C0','FFE8C0','FFE8C0','FFE8C0','FFE8C0','FFE8C0','FFE8C0','FFE8C0','FFE8C0','FFE8C0','FFE8C0','FFE8C0','FFE8C0','FFE8C0','FFE8C0','FFE8C0','FFE8C0','FFE8C0','FFE8C0','FFE8C0','FFE8C0','FFE8C0','FFE8C8','FFE8C8','FFE8C8','FFE8C8','FFE8C8','FFE8C8','FFE8C8','FFE8C8','FFE8C8','FFE8C8','FFE8D0','FFE8D0','FFE8D0','FFE8D0','FFE8D0','FFE8D0','FFE8D0','FFE8D0','FFE8D0','FFE8D0','FFE8D0','FFE8D0','FFE8D0','FFE8D0','FFE8D0','FFE8D0','FFE8D0','FFE8D0','FFE8D0','FFE8D0','FFF098','FFF098','FFF098','FFF098','FFF098','FFF098','FFF098','FFF098','FFF098','FFF098','FFF098','FFF098','FFF0A0','FFF0A0','FFF0A0','FFF0A0','FFF0A0','FFF0A0','FFF0A0','FFF0A0','FFF0A0','FFF0A0','FFF0B8','FFF0B8','FFF0B8','FFF0B8','FFF0B8','FFF0B8','FFF0B8','FFF0B8','FFF0B8','FFF0B8','FFF0C0','FFF0C0','FFF0C0','FFF0C0','FFF0C0','FFF0C0','FFF0C0','FFF0C0','FFF0C0','FFF0C0','FFF0C0','FFF0C0','FFF0C0','FFF0C0','FFF0C0','FFF0C0','FFF0C0','FFF0C0','FFF0C0','FFF0C0','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0C8','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D0','FFF0D8','FFF0D8','FFF0D8','FFF0D8','FFF0D8','FFF0D8','FFF0D8','FFF0D8','FFF0D8','FFF0D8','FFF0D8','FFF0D8','FFF0E8','FFF0E8','FFF0E8','FFF0E8','FFF0E8','FFF0E8','FFF0E8','FFF0E8','FFF0E8','FFF0E8','FFF0E8','FFF0E8','FFF0F8','FFF0F8','FFF0F8','FFF0F8','FFF0F8','FFF0F8','FFF0F8','FFF0F8','FFF0F8','FFF0F8','FFF8B0','FFF8B0','FFF8B0','FFF8B0','FFF8B0','FFF8B0','FFF8B0','FFF8B0','FFF8B0','FFF8B0','FFF8B0','FFF8B0','FFF8C0','FFF8C0','FFF8C0','FFF8C0','FFF8C0','FFF8C0','FFF8C0','FFF8C0','FFF8C0','FFF8C0','FFF8C8','FFF8C8','FFF8C8','FFF8C8','FFF8C8','FFF8C8','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D0','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8D8','FFF8E0','FFF8E0','FFF8E0','FFF8E0','FFF8E0','FFF8E0','FFF8E0','FFF8E0','FFF8E0','FFF8E0','FFF8E0','FFF8E0','FFF8E0','FFF8E0','FFF8E0','FFF8E0','FFF8E0','FFF8E0','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFC8','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD0','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8','FFFFD8']
};


Colors.prototype.random = function(colorId) {
  colorId = (colorId === undefined) ? 'pollockShimmering' : colorId;
  var c = this.colors[colorId];
  return c[Math.floor(Math.random() * c.length)];
}
