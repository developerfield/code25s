import { useState, useEffect, useRef } from "react";

// ── RAW DATABASE ──────────────────────────────────────────────────────────────
const RAW = {"v":"1.0","dims":["karakter","zeka","EQ","guvenilirlik"],"mods":["hafif","orta","zorlu","karsi"],"cats":["karakter","zeka","EQ","guvenilirlik"],"matrix":{"x":"zeka","y":"karakter","zones":[{"id":"kahraman","label":"Kahraman","xmin":50,"ymin":50,"desc":"Hem kendine hem başkasına faydalı. Dengeli ve güvenilir."},{"id":"saf","label":"İyi Niyetli Saf","xmin":0,"xmax":50,"ymin":50,"desc":"Niyeti iyi ama pratik zeka düşük. Farkında olmadan zarar verebilir."},{"id":"bencil","label":"Stratejik Bencil","xmin":50,"ymin":0,"ymax":50,"desc":"Kendine çok faydalı, başkasını umursamaz. Dikkatli olunmalı."},{"id":"tehlikeli","label":"Tehlikeli","xmin":0,"xmax":50,"ymin":0,"ymax":50,"desc":"Ne kendine ne başkasına fayda. Yıkıcı profil."}]},"profiles":[{"id":"strat_emp","label":"Stratejik Empatik","esik":[70,65,70,65],"guclu":["Derin empati","Stratejik düşünce","Güçlü iletişim"],"zayif":["Kararı erteleyebilir","Fazla sorumluluk üstlenir"],"anlasir":["Pragmatik liderler","Duygusal zeka yüksek bireyler","Yaratıcı tipler"],"catisir":["Narsistler","Sürü takipçileri","Manipülatörler"],"matrix":"kahraman"},{"id":"prag_lider","label":"Pragmatik Lider","esik":[60,80,50,60],"guclu":["Hızlı karar verme","Sonuç odaklılık","Analitik güç"],"zayif":["Empatiyi atlayabilir","Sabırsız olabilir"],"anlasir":["Stratejik empatikler","Sessiz stratejistler","Gerçekçiler"],"catisir":["Duygusal kahramanlar","Naif iyimserler","Korkak takipçiler"],"matrix":"kahraman"},{"id":"duy_kahraman","label":"Duygusal Kahraman","esik":[75,45,85,70],"guclu":["Derin bağ kurma","Fedakârlık","Sadakat"],"zayif":["Mantıksal kararları atlayabilir","Duygusal tükeniş"],"anlasir":["Sadık destekçiler","Stratejik empatikler","Dengeli gerçekçiler"],"catisir":["Fırsatçılar","Manipülatörler","Özsever performansçılar"],"matrix":"saf"},{"id":"ses_strat","label":"Sessiz Stratejist","esik":[55,80,45,55],"guclu":["Analitik derinlik","Soğukkanlılık","Uzun vadeli düşünce"],"zayif":["Duygusal bağ kurmakta zorlanır","Yalnızlaşabilir"],"anlasir":["Pragmatik liderler","Dengeli gerçekçiler"],"catisir":["Duygusal kahramanlar","Naif iyimserler"],"matrix":"bencil"},{"id":"firsatci","label":"Fırsatçı","esik":[25,70,40,20],"guclu":["Hızlı adaptasyon","Pratik zeka","Fırsat görme"],"zayif":["Güvensiz","Ahlaki sınırlar bulanık","İlişkileri tüketir"],"anlasir":["Diğer fırsatçılar (kısa vadeli)","Naif iyimserler (istismar riski)"],"catisir":["Sadık destekçiler","Duygusal kahramanlar","Pragmatik liderler"],"matrix":"bencil"},{"id":"naif_iyimser","label":"Naif İyimser","esik":[65,35,65,70],"guclu":["Pozitiflik","Güven duygusu","İyi niyet"],"zayif":["Kolayca istismar edilir","Gerçekçi değerlendirme zayıf"],"anlasir":["Duygusal kahramanlar","Sadık destekçiler"],"catisir":["Fırsatçılar","Manipülatörler","Sessiz stratejistler"],"matrix":"saf"},{"id":"korkak_tak","label":"Korkak Takipçi","esik":[30,40,35,30],"guclu":["Uyum sağlama","Çatışmadan kaçınma"],"zayif":["Baskı altında kaybolur","Öz değeri düşük","Güvenilmez"],"anlasir":["Diğer takipçiler","Otoriter tipler (geçici)"],"catisir":["Liderler","Yüzleşmeci tipler"],"matrix":"tehlikeli"},{"id":"kar_manip","label":"Karizmatik Manipülatör","esik":[20,75,70,15],"guclu":["Sosyal zeka","İkna gücü","Ağ kurma"],"zayif":["Dürüstlük sıfır","Çevresi zamanla erir","Güven kalmaz"],"anlasir":["Naif iyimserler (kurban)","Korkak takipçiler"],"catisir":["Pragmatik liderler","Sadık destekçiler","Stratejik empatikler"],"matrix":"bencil"},{"id":"sadik_dest","label":"Sadık Destekçi","esik":[70,50,60,80],"guclu":["Güvenilirlik","Tutarlılık","Derin sadakat"],"zayif":["Kendi ihtiyaçlarını feda eder","Sınır koymakta zorlanır"],"anlasir":["Duygusal kahramanlar","Pragmatik liderler","Stratejik empatikler"],"catisir":["Fırsatçılar","Manipülatörler","Özsever performansçılar"],"matrix":"kahraman"},{"id":"ozsever_p","label":"Özsever Performansçı","esik":[25,65,30,25],"guclu":["Enerji","Görünürlük","Kendini pazarlama"],"zayif":["Empati yok","Tutarsız","Derin ilişki kuramaz"],"anlasir":["Naif iyimserler","Korkak takipçiler"],"catisir":["Sadık destekçiler","Duygusal kahramanlar","Pragmatik liderler"],"matrix":"bencil"},{"id":"dengeli_g","label":"Dengeli Gerçekçi","esik":[60,60,60,60],"guclu":["Denge","Olgunluk","Güvenilirlik"],"zayif":["Risk almaktan kaçınabilir","Öngörülebilir"],"anlasir":["Neredeyse her profil","Özellikle pragmatik liderler"],"catisir":["Aşırı duygusal tipler","Manipülatörler"],"matrix":"kahraman"},{"id":"isyankar","label":"İsyankâr Özgür Ruh","esik":[55,60,50,40],"guclu":["Özgünlük","Cesaret","Bağımsız düşünce"],"zayif":["Sistem içinde zorlanır","Güvenilirlik düşebilir"],"anlasir":["Stratejik empatikler","Sessiz stratejistler"],"catisir":["Korkak takipçiler","Pragmatik liderler","Otoriter tipler"],"matrix":"kahraman"}],"q":[{"id":1,"m":0,"c":0,"s":"Planladığın bir şeyi yapmak üzereyken yakın arkadaşın yardım istedi. Ne yaparsın?","kt":"Bunu yapmak üzereyken yakın arkadaşı yardım istedi. Ne yapardı?","o":[["Planı erteler, yardım ederim.",[4,2,4,3]],["Duruma bakarım; acil mi, ona göre karar veririm.",[3,5,3,3]],["Üzgün olduğumu söylerim ama planı iptal edemem.",[2,3,2,4]],["Başka birini yönlendiririm.",[2,3,2,2]]]},{"id":2,"m":0,"c":2,"s":"Arkadaşın çok kötü bir gün geçiriyor ve seni arıyor. Sen de yorgunsun. Ne yaparsın?","kt":"Arkadaşı onu aradı, o da yorgundu. Ne yapardı?","o":[["Açar, ne kadar sürese dinlerim.",[4,2,5,4]],["Açar ama yorgun olduğumu söyler, kısa tutarım.",[3,3,3,3]],["Mesaj atarım, 'iyi misin?' derim.",[2,3,2,2]],["O an cevap vermem, ertesi gün ararım.",[1,2,1,1]]]},{"id":3,"m":0,"c":3,"s":"Kimse görmüyor olsa bile kasada sana fazla para üstü verdiler. Ne yaparsın?","kt":"Kimse görmüyorken ona fazla para üstü verildi. Ne yapardı?","o":[["Hemen söylerim, fazlayı iade ederim.",[5,2,3,5]],["Fark ederim ama tutarım.",[1,3,2,1]],["Miktara bakarım; ufaksa tutarım, büyükse söylerim.",[2,4,2,2]],["Fark etmem bile.",[0,1,1,0]]]},{"id":4,"m":0,"c":1,"s":"Yeni bir şey öğrenmen gerektiğinde nasıl yaklaşırsın?","kt":"Yeni bir şey öğrenmesi gerektiğinde nasıl yaklaşırdı?","o":[["Önce büyük resmi anlarım, sonra detaylara inerim.",[3,5,3,3]],["Direkt uygularım, yanılarak öğrenirim.",[3,4,3,3]],["Bilen birine sorarım.",[2,2,2,2]],["Çok zorsa bırakırım.",[1,1,2,1]]]},{"id":5,"m":0,"c":0,"s":"Bir grupta biri hakkında dedikodu yapılıyor, sen o kişiyi tanıyorsun. Ne yaparsın?","kt":"Grupta biri hakkında dedikodu yapılıyordu, o kişiyi tanıyordu. Ne yapardı?","o":[["Sessiz kalırım.",[2,3,2,2]],["Savunurum, 'ben onu farklı tanıyorum' derim.",[5,3,4,5]],["Ben de eklerim.",[0,1,1,0]],["Konuyu değiştirmeye çalışırım.",[3,4,3,3]]]},{"id":6,"m":1,"c":3,"s":"Birine söz verdin ama tutman artık çok pahalıya mal olacak. Ne yaparsın?","kt":"Birine söz vermişti ama tutması çok pahalıya mal olacaktı. Ne yapardı?","o":[["Ne olursa olsun sözümü tutarım.",[4,2,3,5]],["Durumu dürüstçe anlatır, affımı dilerim.",[4,4,4,4]],["Bahane bulurum, asıl sebebi söylemem.",[1,2,2,0]],["Sessizce uzaklaşırım.",[0,1,1,0]]]},{"id":7,"m":1,"c":2,"s":"Birisi seni herkese açık ortamda sert ve haksız eleştiriyor. İlk tepkin ne olur?","kt":"Birisi onu herkese açık ortamda sert ve haksız eleştirdi. İlk tepkisi ne olurdu?","o":[["Anında karşılık veririm.",[2,2,1,2]],["O an sustururum, sonra baş başa konuşurum.",[4,5,5,4]],["İçim yanar ama hiçbir şey demem.",[2,2,2,2]],["Küserim, bir daha konuşmam.",[1,1,1,2]]]},{"id":8,"m":1,"c":0,"s":"Haksız yere suçlandığında ne yaparsın?","kt":"Haksız yere suçlandığında ne yapardı?","o":[["Kendimi net bir şekilde savunurum.",[5,4,4,5]],["Sinirlenip tepki veririm.",[2,1,1,2]],["İçime kapanırım.",[1,1,2,2]],["Nasılsa herkes bilir, uğraşmaya değmez.",[2,3,3,2]]]},{"id":9,"m":1,"c":1,"s":"Uzun süredir uğraştığın projenin işe yaramadığını gördün. Ne yaparsın?","kt":"Uzun süredir uğraştığı projenin işe yaramadığını gördü. Ne yapardı?","o":[["Nerede yanlış yaptığımı analiz eder, yeniden denerim.",[3,5,3,4]],["Bırakırım.",[1,1,1,1]],["Farklı yöntem denerim, aynı hedefe farklı yoldan.",[3,5,3,3]],["Birinin yardım etmesini beklerim.",[1,1,2,1]]]},{"id":10,"m":1,"c":2,"s":"Yakın birinin büyük hata yaptığını düşünüyorsun ama o mutlu. Ne yaparsın?","kt":"Yakınının büyük hata yaptığını düşünüyordu ama o mutluydu. Ne yapardı?","o":[["Doğruyu söylerim.",[4,3,3,5]],["Sormadan karışmam.",[2,2,3,2]],["Zamanı gelince anlar, beklerim.",[2,3,3,2]],["Dikkatli ve nazikçe düşüncemi paylaşırım.",[5,5,5,5]]]},{"id":11,"m":1,"c":0,"s":"Grup içinde herkes yanlış bir karara doğru gidiyorken ne yaparsın?","kt":"Grup içinde herkes yanlış bir karara doğru gidiyorken ne yapardı?","o":[["Sessiz kalırım.",[1,2,2,1]],["Açıkça itiraz eder, neden yanlış olduğunu anlatırım.",[5,4,4,5]],["Sadece güvendiğim kişilere söylerim.",[3,3,3,3]],["Gidişatı izler, hata çıkınca konuşurum.",[2,3,2,2]]]},{"id":12,"m":1,"c":1,"s":"3 teklif: Çok para/sevmediğin iş — Az para/sevdiğin iş — Orta para/orta iş. Ne seçersin?","kt":"3 teklif gelse ne seçerdi?","o":[["Çok para. Sonra sevdiğim şeyleri yaparım.",[2,3,2,2]],["Az para olsa da sevdiğim iş.",[4,3,4,4]],["Orta yol, dengeli yaşam.",[3,4,3,3]],["Şu anki ihtiyacıma göre karar veririm.",[3,5,3,3]]]},{"id":13,"m":2,"c":3,"s":"Seni öne geçirecek fırsat var ama bir meslektaşını küçük yalanla ezmek gerekiyor. Ne yaparsın?","kt":"Onu öne geçirecek fırsat vardı ama meslektaşını küçük yalanla ezmek gerekiyordu. Ne yapardı?","o":[["Yaparım, iş hayatı böyle.",[0,3,1,0]],["Yapmam, başka yollar ararım.",[5,4,4,5]],["Yalan değil ama 'küçük çarpıtma' yaparım.",[1,3,2,1]],["Fırsatı kaçırırım, vicdanım rahat olsun.",[4,2,3,5]]]},{"id":14,"m":2,"c":0,"s":"Çok güvendiğin arkadaşının seni arkandan ciddi şekilde istismar ettiğini öğreniyorsun. Ne yaparsın?","kt":"Çok güvendiği arkadaşının onu ciddi şekilde istismar ettiğini öğrendi. Ne yapardı?","o":[["Yüzleşirim, her şeyi açıkça konuşurum.",[5,4,4,5]],["Sessizce hayatımdan çıkarırım.",[3,3,3,3]],["Onu mahvetmek için harekete geçerim.",[1,2,0,2]],["Belki yanlış anlaşılmadır, tekrar düşünürüm.",[2,1,2,2]]]},{"id":15,"m":2,"c":1,"s":"İki seçenek: Garantili ama sıradan yaşam / Riskli ama büyük ihtimalle çok daha iyi yaşam. Ne seçersin?","kt":"Bu iki seçenek olsaydı hangisini seçerdi?","o":[["Riski göze alırım.",[3,4,3,3]],["Garantiyi seçerim.",[2,2,2,3]],["Riski azaltmak için hazırlanır, sonra adım atarım.",[4,5,4,4]],["Karar veremem, ertelerim.",[1,1,1,1]]]},{"id":16,"m":2,"c":2,"s":"Yıllardır çalıştığın şeyin başkası tarafından önüne geçildi. İçsel tepkin ne olur?","kt":"Yıllardır çalıştığı şeyin önüne geçildi. İçsel tepkisi ne olurdu?","o":[["Yıkılırım ama zamanla toparlarım.",[3,2,3,3]],["O kişiye derin kırgınlık duyarım.",[1,1,1,2]],["Acı verici ama hayatın parçası, devam ederim.",[4,4,5,4]],["Nerede hata yaptım diye analiz eder, daha güçlü dönerim.",[4,5,4,4]]]},{"id":17,"m":2,"c":0,"s":"Çok sevdiğin biri senden ahlaki açıdan yanlış bir şey yapmanı istiyor. Ne yaparsın?","kt":"Çok sevdiği biri ondan ahlaki açıdan yanlış bir şey yapmasını istedi. Ne yapardı?","o":[["Reddederim, sevgi ahlakın önüne geçemez.",[5,4,3,5]],["Onu kaybetmemek için yaparım.",[0,1,1,0]],["Neden istediğini anlar, başka yol öneririm.",[4,5,5,4]],["Net karar veremem.",[2,2,2,1]]]},{"id":18,"m":2,"c":3,"s":"Bir sırrı saklamak zorunda kaldın ama bu sır başkasına zarar veriyor. Ne yaparsın?","kt":"Bir sırrı saklamak zorundaydı ama bu sır başkasına zarar veriyordu. Ne yapardı?","o":[["Sırrı saklarım, söz verdim.",[2,2,2,4]],["Zarar göreni uyarırım ama detay vermem.",[4,5,4,4]],["Her şeyi açıklarım, zarar daha önemli.",[4,3,4,3]],["Hiçbir şey yapmam.",[0,1,0,0]]]},{"id":19,"m":2,"c":1,"s":"Yanlış olduğunu düşündüğün ama herkesin doğru sandığı bir bilgi var. Ne yaparsın?","kt":"Yanlış olduğunu düşündüğü ama herkesin doğru sandığı bir bilgi vardı. Ne yapardı?","o":[["Araştırırım, emin olduktan sonra paylaşırım.",[4,5,3,5]],["Herkese karşı çıkmak istemem, sessiz kalırım.",[1,2,2,1]],["Hemen itiraz ederim.",[3,3,2,3]],["Belki ben yanılıyorumdur diye tekrar düşünürüm.",[3,4,3,3]]]},{"id":20,"m":2,"c":2,"s":"Çok önemli karar vermek zorundasın ama duygusal olarak çok çalkantılı bir dönemdeysin. Ne yaparsın?","kt":"Önemli karar vermek zorundaydı ama duygusal olarak çok çalkantılıydı. Ne yapardı?","o":[["Hemen karar veririm.",[2,1,1,2]],["Mümkünse beklerim, sakin kafayla karar vermek isterim.",[3,5,5,4]],["Güvendiğim birine danışırım.",[3,4,4,3]],["Duyguları görmezden gelerek sadece mantıkla karar veririm.",[2,3,2,3]]]},{"id":21,"m":3,"c":0,"s":"Ortak bir arkadaşınızla kavga ettiğinizde genellikle ne yapardı?","kt":null,"o":[["Yüzleşirdi.",[5,4,4,4]],["Sessizce küserdi.",[2,2,1,2]],["Diğer arkadaşları aracı kullanırdı.",[2,2,2,2]],["Haksız da olsa özür dilerdi.",[3,2,3,3]]]},{"id":22,"m":3,"c":3,"s":"Sana bir sır verdiğinde ne kadar sürede başkasına söylerdi?","kt":null,"o":[["Asla söylemezdi.",[5,3,4,5]],["Çok yakın birine söyler ama 'kimseye söyleme' derdi.",[1,2,2,1]],["Fırsatını bulsa anlatırdı.",[0,1,1,0]],["Söylemez ama belli ederdi.",[1,2,1,1]]]},{"id":23,"m":3,"c":2,"s":"Çok stresli ve zor bir dönemindeyken nasıl davranırdı?","kt":null,"o":[["İçine kapanır, yalnız kalmak isterdi.",[2,2,2,2]],["Sinirli olur, etrafına yansıtırdı.",[1,1,0,1]],["Zorlandığını belli eder ama kontrollü kalırdı.",[4,3,4,4]],["Her şey yolundaymış gibi davranırdı.",[3,3,3,3]]]},{"id":24,"m":3,"c":1,"s":"Yanlış bir karar verdiği ortaya çıktığında nasıl tepki verirdi?","kt":null,"o":[["Kabul eder, nerede hata yaptığını anlardı.",[5,5,4,5]],["Savunmaya geçer, hatasını kabul etmezdi.",[1,1,1,0]],["Başkalarını suçlardı.",[0,0,0,0]],["Mahcup olur, üzerine gidilmesini istemezdi.",[3,2,2,3]]]},{"id":25,"m":3,"c":0,"s":"Grup içinde popüler olmayan ama doğru olan bir görüşü savunmak gerektiğinde ne yapardı?","kt":null,"o":[["Sessiz kalır, ortamı bozmak istemezdi.",[1,2,2,1]],["Açıkça savunurdu.",[5,4,4,5]],["Sadece güvendiği kişilere söylerdi.",[3,3,3,3]],["Dolaylı yoldan söylemeye çalışırdı.",[2,3,3,2]]]},{"id":26,"m":0,"c":2,"s":"Arkadaşın seni beklenmedik bir anda eleştirdi. İlk tepkin ne olur?","kt":"Arkadaşı onu beklenmedik anda eleştirdi. İlk tepkisi ne olurdu?","o":[["Şaşırırım ama dinlerim, haklı mı diye düşünürüm.",[4,5,5,4]],["Hemen savunmaya geçerim.",[2,2,1,2]],["Kırılırım, içime kapanırım.",[1,1,1,2]],["Gülerek geçiştiririm ama aklımda kalır.",[2,3,2,2]]]},{"id":27,"m":1,"c":3,"s":"Seninle paylaşılan özel bir bilgiyi, başkasına söylemenin büyük avantaj sağlayacağı durumda ne yapardı?","kt":null,"o":[["Asla söylemez.",[5,3,3,5]],["Çok büyük avantaj varsa söylerdi.",[0,3,1,0]],["Söylemez ama durumu kendi lehine farklı şekilde kullanırdı.",[1,4,2,1]],["Söylemez ama içten içe zorlanırdı.",[4,2,3,4]]]},{"id":28,"m":1,"c":1,"s":"İki kişi aynı konuda sana tamamen zıt bilgi veriyor. Ne yaparsın?","kt":"İki kişi ona tamamen zıt bilgi verdi. Ne yapardı?","o":[["Daha güvenilir bulduğuma inanırım.",[2,2,2,2]],["Kendi araştırımı yaparım.",[4,5,3,4]],["İkisini birlikte değerlendiririm.",[3,5,4,3]],["Karışırım, bilmiyorum derim.",[2,1,2,2]]]},{"id":29,"m":1,"c":0,"s":"Biri senden bir iyilik istiyor, zor gelecek ama reddetmek de mümkün. Ne yaparsın?","kt":"Birisi ondan iyilik istedi, zor gelecek ama reddetmek de mümkündü. Ne yapardı?","o":[["Zorlanacağımı söyler ama yine de yaparım.",[5,3,4,5]],["Reddederim, herkesin sınırı var.",[3,4,3,3]],["Kabul ederim ama içten içe küsmeye başlarım.",[1,1,1,2]],["Duruma göre karar veririm.",[3,5,4,3]]]},{"id":30,"m":2,"c":2,"s":"Uzun süredir bastırdığın bir öfken var. Biriyle kavga ettiğinde ne olur?","kt":"Uzun süredir bastırdığı öfkesi vardı. Biriyle kavga ettiğinde ne olurdu?","o":[["Her şey birden dışarı çıkar, aşırı tepki veririm.",[1,1,0,1]],["Kontrol ederim, sadece o anı konuşurum.",[4,4,5,4]],["Çok susarım, asıl meseleyi konuşamam.",[2,2,2,2]],["Kavgadan kaçınırım.",[2,2,2,1]]]},{"id":31,"m":0,"c":1,"s":"Bir toplantıda herkes seni dinlerken konuşuyorsun. En çok neye dikkat edersin?","kt":"Bir toplantıda herkes onu dinlerken konuşuyordu. En çok neye dikkat ederdi?","o":[["Doğru ve net bilgi vermek.",[4,5,3,5]],["İyi izlenim bırakmak.",[2,3,3,2]],["Herkesi memnun etmek.",[1,2,3,1]],["Konunun özünü aktarmak.",[3,5,3,4]]]},{"id":32,"m":1,"c":0,"s":"Yardım ettiğin biri hiç teşekkür etmedi. Bu senin için ne ifade eder?","kt":"Yardım ettiği biri hiç teşekkür etmedi. Bu onun için ne ifade ederdi?","o":[["Beni rahatsız etmez, yardım etmek için yaptım.",[5,3,4,5]],["Bir dahaki sefere yardım etmem.",[1,2,2,1]],["Kötü hissederim ama bir şey söylemem.",[2,2,2,2]],["O kişiyi gözlemlerim, ona göre karar veririm.",[3,4,3,3]]]},{"id":33,"m":2,"c":1,"s":"Çok güvendiğin bir bilginin yanlış olduğunu öğrendin. Bu senin için ne ifade eder?","kt":"Çok güvendiği bir bilginin yanlış olduğunu öğrendi. Bu onun için ne ifade ederdi?","o":[["Kabul etmekte zorlanırım ama sonunda kabul ederim.",[3,4,3,3]],["Hemen kabul eder ve güncellerim.",[4,5,4,5]],["Reddederim, bu kaynaklar güvenilmez.",[0,0,1,0]],["Yeni bilgiyi de sorgularım, araştırırım.",[4,5,4,4]]]},{"id":34,"m":0,"c":2,"s":"Yakının çok sevinçli bir haber paylaşıyor ama sen bunun gerçekçi olmadığını düşünüyorsun. Ne yaparsın?","kt":"Yakını sevinçli haber paylaştı ama gerçekçi olmadığını düşünüyordu. Ne yapardı?","o":[["Onunla sevinirim.",[2,2,4,2]],["Sevinci paylaşır ama nazikçe düşüncemi de belirtirim.",[5,5,5,5]],["Direkt 'bu olmaz' derim.",[3,3,1,3]],["Bir şey demem ama içimde endişelenirim.",[2,2,2,2]]]},{"id":35,"m":2,"c":0,"s":"Çok güçlü biri seni haksız yere köşeye sıkıştırıyor. Onun gücüne ihtiyacın var. Ne yaparsın?","kt":"Çok güçlü biri onu haksız yere köşeye sıkıştırdı. O kişinin gücüne ihtiyacı vardı. Ne yapardı?","o":[["Boyun eğerim, pratik olmak gerekir.",[0,2,1,0]],["Hakkımı savunurum.",[5,3,3,5]],["Şimdi kabul görünür, sonra fırsatı kollarım.",[2,5,3,2]],["Kabul eder ama derin kırgınlık kalır.",[2,2,2,2]]]},{"id":36,"m":1,"c":3,"s":"Güvendiğin biri sana yanlış tavsiye verdi ve zarar gördün. Ne yaparsın?","kt":"Güvendiği biri ona yanlış tavsiye verdi ve zarar gördü. Ne yapardı?","o":[["Kendi kararımdı, ona kızmam.",[4,4,4,4]],["Yüzleşirim.",[4,3,3,4]],["Kızarım ama söylemem, içimde bitirir.",[1,2,1,2]],["Bir daha tavsiye sormam, ilişki devam eder.",[3,4,3,3]]]},{"id":37,"m":0,"c":0,"s":"Senden çok daha başarılı olan biriyle tanışıyorsun. İçinde ne hissedersin?","kt":"Kendindenç ok daha başarılı biriyle tanıştığında içinde ne hissederdi?","o":[["İlham alırım, ondan öğrenebileceklerimi düşünürüm.",[5,5,5,4]],["Kıskançlık hissederim, bunu kabul ediyorum.",[3,3,4,4]],["Kendimi küçük hissederim.",[1,1,1,2]],["Onu küçümseyecek bir şeyler ararım.",[0,1,0,0]]]},{"id":38,"m":1,"c":2,"s":"Birisi sana sürekli sorunlarını anlatıyor, çözüm istemiyor, sadece dinlenmek istiyor. Ne yaparsın?","kt":"Birisi ona sürekli sorunlarını anlatıyor, çözüm istemiyor. Ne yapardı?","o":[["Sabırla dinlerim.",[4,3,5,4]],["Bir süre sonra tavsiye vermeye başlarım.",[3,3,2,3]],["İçimden sıkılırım ama dışarıdan dinliyormuş gibi yaparım.",[1,2,2,1]],["Bunu beklemenin adil olmadığını söylerim.",[4,4,3,4]]]},{"id":39,"m":2,"c":1,"s":"10 yıl sonra ne yapmak istediğini bilmiyorsun. Bu seni nasıl hissettiriyor?","kt":"10 yıl sonra ne yapmak istediğini bilmiyordu. Bu onu nasıl hissettirirdi?","o":[["Kaygılı ve kararsız hissederim.",[2,2,2,2]],["Normal karşılarım.",[3,3,3,3]],["Rahatsız etmez, yön bulacağıma güvenirim.",[4,4,5,4]],["Aktif olarak kendi yönümü çizmeye çalışırım.",[4,5,4,4]]]},{"id":40,"m":2,"c":0,"s":"Hayatının en zor dönemini yaşıyorsun. Bunu kimlerle paylaşırsın?","kt":"Hayatının en zor dönemini yaşıyordu. Bunu kimlerle paylaşırdı?","o":[["Kimseyle paylaşmam.",[2,2,1,2]],["Sadece en yakın 1-2 kişiyle.",[4,4,4,4]],["Etrafımdaki herkese anlatırım.",[2,1,2,2]],["Kimseyle paylaşmam ama profesyonel destek alırım.",[4,5,4,4]]]}],"scoring":{"mod_soru_sayisi":{"hafif":10,"orta":10,"zorlu":10,"karsi":5},"max_puan_per_boyut":200,"profil_esleme":"en_yakin_esik","tutarlilik_bonus":10,"dayaniklilik_kaynak_modlar":[2],"niyet_zeka_x_boyut":1,"niyet_zeka_y_boyut":0}};

// ── ŞEMA & YARDIMCI FONKSİYONLAR ─────────────────────────────────────────────

// Mod index → renk/ikon şeması
const MOD_SCHEMA = [
  { label: "Hafif",      color: "#4ade80", bg: "rgba(74,222,128,0.12)",  icon: "○" },
  { label: "Orta",       color: "#facc15", bg: "rgba(250,204,21,0.12)",  icon: "◈" },
  { label: "Zorlu",      color: "#f87171", bg: "rgba(248,113,113,0.12)", icon: "◆" },
  { label: "Karşı Taraf",color: "#a78bfa", bg: "rgba(167,139,250,0.12)", icon: "⬡" },
];

// Kategori index → ikon/renk şeması
const CAT_SCHEMA = [
  { label: "Karakter",    icon: "♟", color: "#f472b6" },
  { label: "Zeka",        icon: "◎", color: "#38bdf8" },
  { label: "EQ",          icon: "❋", color: "#fb923c" },
  { label: "Güvenilirlik",icon: "⬡", color: "#4ade80" },
];

// Seçenek harfleri
const HARFLER = ["A","B","C","D"];

// Puan hesaplama
function hesaplaPuanlar(cevaplar, sorular) {
  const toplamlar = [0,0,0,0];
  const sayilar   = [0,0,0,0];
  sorular.forEach(q => {
    const sec = cevaplar[q.id];
    if (sec == null) return;
    q.o[sec][1].forEach((p,i) => { toplamlar[i]+=p; sayilar[i]++; });
  });
  // Normalize 0-100
  return toplamlar.map((t,i) => sayilar[i]===0 ? 0 : Math.round((t/(sayilar[i]*5))*100));
}

// Tutarlılık: aynı kategori sorularında standart sapma düşükse yüksek
function hesaplaTutarlilik(cevaplar, sorular) {
  const catPuanlar = RAW.dims.map(() => []);
  sorular.forEach(q => {
    const sec = cevaplar[q.id];
    if (sec == null) return;
    q.o[sec][1].forEach((p,i) => catPuanlar[i].push(p));
  });
  const sapma = catPuanlar.map(arr => {
    if (arr.length < 2) return 0;
    const ort = arr.reduce((a,b)=>a+b,0)/arr.length;
    return Math.sqrt(arr.reduce((a,b)=>a+(b-ort)**2,0)/arr.length);
  });
  const ortSapma = sapma.reduce((a,b)=>a+b,0)/sapma.length;
  return Math.max(0, Math.round(100 - ortSapma*20));
}

// Dayanıklılık: sadece zorlu mod sorularının ortalaması
function hesaplaDayaniklilik(cevaplar, sorular) {
  const zorluSorular = sorular.filter(q => q.m === 2);
  if (!zorluSorular.length) return 0;
  let top = 0, say = 0;
  zorluSorular.forEach(q => {
    const sec = cevaplar[q.id];
    if (sec == null) return;
    const puan = q.o[sec][1].reduce((a,b)=>a+b,0)/4;
    top+=puan; say++;
  });
  return say===0 ? 0 : Math.round((top/(say*5))*100);
}

// Profil eşleştirme: en yakın profil
function eslesProfil(puanlar100) {
  let enIyi = null, enDusukFark = Infinity;
  RAW.profiles.forEach(p => {
    const fark = p.esik.reduce((acc,e,i) => acc + Math.abs(e - puanlar100[i]), 0);
    if (fark < enDusukFark) { enDusukFark=fark; enIyi=p; }
  });
  return enIyi;
}

// Niyet-Zeka matrisi bölgesi
function matrisBolge(puanlar100) {
  const x = puanlar100[RAW.scoring.niyet_zeka_x_boyut]; // zeka
  const y = puanlar100[RAW.scoring.niyet_zeka_y_boyut]; // karakter
  return RAW.matrix.zones.find(z => {
    const xok = (z.xmin==null||x>=z.xmin) && (z.xmax==null||x<z.xmax);
    const yok = (z.ymin==null||y>=z.ymin) && (z.ymax==null||y<z.ymax);
    return xok&&yok;
  }) || RAW.matrix.zones[0];
}

// Mod filtresi: seçilen moda göre soru listesi oluştur
function sorulariFiltrele(modIndex, sorular) {
  if (modIndex === 3) return sorular.filter(q => q.m === 3);
  return sorular.filter(q => q.m === modIndex);
}

// ── ANA UYGULAMA ──────────────────────────────────────────────────────────────
export default function App() {
  const [ekran, setEkran] = useState("giris"); // giris | test | sonuc
  const [secilenMod, setSecilenMod] = useState(null);
  const [aktifSorular, setAktifSorular] = useState([]);
  const [cevaplar, setCevaplar] = useState({});
  const [aktifIndex, setAktifIndex] = useState(0);
  const [sonuc, setSonuc] = useState(null);
  const [animasyon, setAnimasyon] = useState(false);
  const sorularRef = useRef(null);

  const toplamSoru = aktifSorular.length;
  const ilerleme = toplamSoru > 0 ? Math.round((Object.keys(cevaplar).length / toplamSoru)*100) : 0;

  function modSec(idx) {
    setSecilenMod(idx);
    const filtreli = sorulariFiltrele(idx, RAW.q);
    setAktifSorular(filtreli);
    setCevaplar({});
    setAktifIndex(0);
    setAnimasyon(true);
    setTimeout(() => { setEkran("test"); setAnimasyon(false); }, 300);
  }

  function cevapSec(soruId, secIdx) {
    const yeni = {...cevaplar, [soruId]: secIdx};
    setCevaplar(yeni);
    // Sonraki soruya geç
    setTimeout(() => {
      if (aktifIndex < toplamSoru - 1) {
        setAktifIndex(i => i+1);
        sorularRef.current?.scrollTo({top:0, behavior:"smooth"});
      }
    }, 280);
  }

  function hesaplaVeGoster() {
    const puanlar = hesaplaPuanlar(cevaplar, aktifSorular);
    const profil = eslesProfil(puanlar);
    const bolge = matrisBolge(puanlar);
    const tutarlilik = hesaplaTutarlilik(cevaplar, aktifSorular);
    const dayaniklilik = hesaplaDayaniklilik(cevaplar, aktifSorular);
    setSonuc({ puanlar, profil, bolge, tutarlilik, dayaniklilik });
    setEkran("sonuc");
  }

  function yenidenBasla() {
    setEkran("giris"); setSecilenMod(null);
    setAktifSorular([]); setCevaplar({});
    setAktifIndex(0); setSonuc(null);
  }

  // ── RENDER: GİRİŞ ─────────────────────────────────────────────────────────
  if (ekran === "giris") return (
    <div style={S.sayfa}>
      <div style={S.girisKart}>
        <div style={S.logo}>◈</div>
        <h1 style={S.baslik}>KİŞİLİK<br/>ANALİZİ</h1>
        <p style={S.altBaslik}>Sorulara verilen cevaplar doğrultusunda<br/>derinlemesine bir karakter analizi üretir.</p>
        <div style={S.modGrid}>
          {MOD_SCHEMA.map((mod, i) => (
            <button key={i} style={{...S.modBtn, borderColor: mod.color, background: mod.bg}}
              onClick={() => modSec(i)}>
              <span style={{color: mod.color, fontSize:22}}>{mod.icon}</span>
              <span style={{color:"#f1f5f9", fontWeight:700, fontSize:15}}>{mod.label}</span>
              <span style={{color:"#94a3b8", fontSize:12}}>
                {i===3 ? "Karşı taraf odaklı" : i===0?"Temel sorular":i===1?"Orta düzey":"Derin sorular"}
              </span>
            </button>
          ))}
        </div>
        <p style={{color:"#475569", fontSize:12, marginTop:24}}>Bir mod seçerek teste başlayın</p>
      </div>
    </div>
  );

  // ── RENDER: TEST ──────────────────────────────────────────────────────────
  if (ekran === "test") {
    const soru = aktifSorular[aktifIndex];
    const mod = MOD_SCHEMA[soru.m];
    const kat = CAT_SCHEMA[soru.c];
    const soruMetni = secilenMod === 3 ? soru.s : soru.s;
    const cevaplandi = Object.keys(cevaplar).length;
    const tumCevaplandi = cevaplandi === toplamSoru;

    return (
      <div style={S.sayfa}>
        <div style={S.testKap} ref={sorularRef}>
          {/* Üst bar */}
          <div style={S.ustBar}>
            <button style={S.geriBtn} onClick={yenidenBasla}>← Geri</button>
            <div style={S.ilerlemeBar}>
              <div style={{...S.ilerlemeDolu, width:`${ilerleme}%`}}/>
            </div>
            <span style={{color:"#64748b", fontSize:13}}>{cevaplandi}/{toplamSoru}</span>
          </div>

          {/* Soru navigasyon noktaları */}
          <div style={S.noktalarkap}>
            {aktifSorular.map((q,i) => (
              <button key={q.id} onClick={()=>setAktifIndex(i)}
                style={{...S.nokta,
                  background: cevaplar[q.id]!=null ? "#4ade80" : i===aktifIndex ? "#f1f5f9" : "#1e293b",
                  border: i===aktifIndex ? "2px solid #f1f5f9" : "2px solid transparent"
                }}/>
            ))}
          </div>

          {/* Soru kartı */}
          <div style={{...S.soruKart, borderColor: mod.color}}>
            <div style={S.soruUstEtiketler}>
              <span style={{...S.etiket, background: mod.bg, color: mod.color}}>
                {mod.icon} {mod.label}
              </span>
              <span style={{...S.etiket, background:`${kat.color}18`, color: kat.color}}>
                {kat.icon} {kat.label}
              </span>
              <span style={{...S.etiket, background:"#1e293b", color:"#64748b"}}>
                {aktifIndex+1} / {toplamSoru}
              </span>
            </div>
            <p style={S.soruMetin}>{soruMetni}</p>
          </div>

          {/* Seçenekler — şema ile üretilir */}
          <div style={S.seceneklerKap}>
            {soru.o.map((opt, idx) => {
              const secili = cevaplar[soru.id] === idx;
              return (
                <button key={idx}
                  style={{...S.secenekBtn,
                    background: secili ? `${mod.color}22` : "#0f172a",
                    borderColor: secili ? mod.color : "#1e293b",
                    transform: secili ? "translateX(6px)" : "none"
                  }}
                  onClick={() => cevapSec(soru.id, idx)}>
                  <span style={{...S.harf, background: secili ? mod.color : "#1e293b", color: secili?"#0f172a":"#64748b"}}>
                    {HARFLER[idx]}
                  </span>
                  <span style={{color: secili?"#f1f5f9":"#94a3b8", textAlign:"left", flex:1, fontSize:14, lineHeight:1.5}}>
                    {opt[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Alt navigasyon */}
          <div style={S.altNav}>
            <button style={{...S.navBtn, opacity: aktifIndex===0?0.3:1}}
              onClick={() => setAktifIndex(i=>Math.max(0,i-1))}
              disabled={aktifIndex===0}>← Önceki</button>

            {tumCevaplandi ? (
              <button style={S.analizBtn} onClick={hesaplaVeGoster}>
                Analizi Gör ◆
              </button>
            ) : (
              <button style={{...S.navBtn, opacity: aktifIndex===toplamSoru-1?0.3:1}}
                onClick={() => setAktifIndex(i=>Math.min(toplamSoru-1,i+1))}
                disabled={aktifIndex===toplamSoru-1}>Sonraki →</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER: SONUÇ ─────────────────────────────────────────────────────────
  if (ekran === "sonuc" && sonuc) {
    const { puanlar, profil, bolge, tutarlilik, dayaniklilik } = sonuc;
    const matrisBolgeRenk = { kahraman:"#4ade80", saf:"#facc15", bencil:"#f87171", tehlikeli:"#ef4444" };
    const bolgeRenk = matrisBolgeRenk[bolge.id] || "#64748b";

    // Genel skor: boyutların ortalaması
    const genelSkor = Math.round(puanlar.reduce((a,b)=>a+b,0)/4);

    return (
      <div style={S.sayfa}>
        <div style={S.sonucKap}>

          {/* Başlık */}
          <div style={S.sonucBaslikBlok}>
            <div style={{color:"#64748b", fontSize:13, letterSpacing:3, marginBottom:8}}>ANALİZ RAPORU</div>
            <h2 style={{...S.profilAdi, color: bolgeRenk}}>{profil.label}</h2>
            <div style={{...S.matrisEtiket, background:`${bolgeRenk}18`, color:bolgeRenk}}>
              {bolge.label} — {bolge.desc}
            </div>
          </div>

          {/* Genel Skor */}
          <div style={S.genelSkorBlok}>
            {[
              {label:"Genel", val:genelSkor, renk:"#f1f5f9"},
              {label:"Tutarlılık", val:tutarlilik, renk:"#a78bfa"},
              {label:"Dayanıklılık", val:dayaniklilik, renk:"#f87171"},
            ].map((item,i) => (
              <div key={i} style={S.skorKutu}>
                <div style={{color:item.renk, fontSize:28, fontWeight:800}}>{item.val}</div>
                <div style={{color:"#475569", fontSize:11}}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* Boyut çubukları — şema ile üretilir */}
          <div style={S.bolum}>
            <div style={S.bolumBaslik}>◈ BOYUT ANALİZİ</div>
            {RAW.dims.map((dim,i) => {
              const kat = CAT_SCHEMA[i];
              const p = puanlar[i];
              return (
                <div key={i} style={S.boyutSatir}>
                  <div style={{display:"flex", justifyContent:"space-between", marginBottom:6}}>
                    <span style={{color:"#94a3b8", fontSize:13}}>{kat.icon} {kat.label}</span>
                    <span style={{color:kat.color, fontWeight:700, fontSize:13}}>{p}/100</span>
                  </div>
                  <div style={S.cubukAlt}>
                    <div style={{...S.cubukDolu, width:`${p}%`, background:kat.color}}/>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Güçlü / Zayıf — şema ile üretilir */}
          <div style={{...S.ikiSutun}}>
            {[
              {baslik:"💪 GÜÇLÜ YÖNLER", liste: profil.guclu, renk:"#4ade80"},
              {baslik:"⚠ ZAYIF YÖNLER",  liste: profil.zayif,  renk:"#f87171"},
            ].map((blok,i) => (
              <div key={i} style={{...S.bolum, flex:1}}>
                <div style={{...S.bolumBaslik, color:blok.renk}}>{blok.baslik}</div>
                {blok.liste.map((item,j) => (
                  <div key={j} style={{...S.madde, borderColor:blok.renk+"33"}}>{item}</div>
                ))}
              </div>
            ))}
          </div>

          {/* İlişki Uyumu — şema ile üretilir */}
          <div style={{...S.ikiSutun}}>
            {[
              {baslik:"🤝 İYİ ANLAŞIR", liste: profil.anlasir, renk:"#38bdf8"},
              {baslik:"⚡ ÇATIŞIR",      liste: profil.catisir, renk:"#fb923c"},
            ].map((blok,i) => (
              <div key={i} style={{...S.bolum, flex:1}}>
                <div style={{...S.bolumBaslik, color:blok.renk}}>{blok.baslik}</div>
                {blok.liste.map((item,j) => (
                  <div key={j} style={{...S.madde, borderColor:blok.renk+"33"}}>{item}</div>
                ))}
              </div>
            ))}
          </div>

          {/* Niyet-Zeka Matrisi görselleştirme */}
          <div style={S.bolum}>
            <div style={S.bolumBaslik}>◎ NİYET-ZEKA MATRİSİ</div>
            <div style={S.matrisGrid}>
              {RAW.matrix.zones.map((z,i) => {
                const aktif = z.id === bolge.id;
                const r = matrisBolgeRenk[z.id];
                return (
                  <div key={i} style={{...S.matrisHucre,
                    background: aktif ? `${r}22` : "#0a0f1a",
                    border: aktif ? `2px solid ${r}` : "2px solid #1e293b"
                  }}>
                    <div style={{color: aktif?r:"#475569", fontWeight:700, fontSize:13}}>{z.label}</div>
                    {aktif && <div style={{color:r, fontSize:18}}>◆</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cevaplanan soru özeti */}
          <div style={S.bolum}>
            <div style={S.bolumBaslik}>◈ TEST ÖZETİ</div>
            <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
              {MOD_SCHEMA.map((mod,i) => {
                const sayi = aktifSorular.filter(q=>q.m===i).length;
                if(!sayi) return null;
                return (
                  <div key={i} style={{...S.etiket, background:mod.bg, color:mod.color}}>
                    {mod.icon} {mod.label}: {sayi} soru
                  </div>
                );
              })}
              <div style={{...S.etiket, background:"#1e293b", color:"#94a3b8"}}>
                Yanıtlanan: {Object.keys(cevaplar).length}/{toplamSoru}
              </div>
            </div>
          </div>

          <button style={S.analizBtn} onClick={yenidenBasla}>
            ← Yeni Analiz
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// ── STİL ŞEMALARI ─────────────────────────────────────────────────────────────
const S = {
  sayfa: {
    minHeight:"100vh", background:"#060b14",
    display:"flex", justifyContent:"center", alignItems:"flex-start",
    fontFamily:"'Georgia', 'Times New Roman', serif",
    padding:"24px 16px", boxSizing:"border-box",
  },
  girisKart: {
    maxWidth:480, width:"100%", textAlign:"center",
    paddingTop:48,
  },
  logo: {
    fontSize:56, color:"#4ade80", lineHeight:1, marginBottom:16,
    textShadow:"0 0 40px rgba(74,222,128,0.5)",
  },
  baslik: {
    color:"#f1f5f9", fontSize:38, fontWeight:800, letterSpacing:8,
    margin:"0 0 12px", lineHeight:1.1,
  },
  altBaslik: {
    color:"#475569", fontSize:14, lineHeight:1.7, margin:"0 0 36px",
  },
  modGrid: {
    display:"grid", gridTemplateColumns:"1fr 1fr", gap:12,
  },
  modBtn: {
    display:"flex", flexDirection:"column", alignItems:"center", gap:6,
    padding:"20px 16px", borderRadius:12, border:"1.5px solid",
    cursor:"pointer", transition:"all 0.2s", background:"transparent",
  },
  testKap: {
    maxWidth:600, width:"100%", paddingBottom:40,
  },
  ustBar: {
    display:"flex", alignItems:"center", gap:12, marginBottom:20,
  },
  geriBtn: {
    background:"transparent", border:"none", color:"#475569",
    cursor:"pointer", fontSize:13, padding:0, whiteSpace:"nowrap",
  },
  ilerlemeBar: {
    flex:1, height:4, background:"#1e293b", borderRadius:2, overflow:"hidden",
  },
  ilerlemeDolu: {
    height:"100%", background:"#4ade80", transition:"width 0.4s ease",
  },
  noktalarkap: {
    display:"flex", flexWrap:"wrap", gap:6, marginBottom:20,
  },
  nokta: {
    width:10, height:10, borderRadius:"50%", padding:0,
    cursor:"pointer", transition:"all 0.2s",
  },
  soruKart: {
    border:"1.5px solid", borderRadius:16, padding:"20px 20px 16px",
    marginBottom:16, background:"#0a0f1a",
  },
  soruUstEtiketler: {
    display:"flex", gap:8, flexWrap:"wrap", marginBottom:14,
  },
  etiket: {
    fontSize:11, fontWeight:700, letterSpacing:1, padding:"3px 10px",
    borderRadius:20, display:"inline-flex", alignItems:"center", gap:4,
  },
  soruMetin: {
    color:"#e2e8f0", fontSize:16, lineHeight:1.7, margin:0, fontStyle:"italic",
  },
  seceneklerKap: {
    display:"flex", flexDirection:"column", gap:10,
  },
  secenekBtn: {
    display:"flex", alignItems:"center", gap:14, padding:"14px 16px",
    borderRadius:12, border:"1.5px solid", cursor:"pointer",
    transition:"all 0.2s", textAlign:"left", width:"100%",
  },
  harf: {
    width:28, height:28, borderRadius:6, display:"flex",
    alignItems:"center", justifyContent:"center",
    fontWeight:800, fontSize:13, flexShrink:0, transition:"all 0.2s",
  },
  altNav: {
    display:"flex", justifyContent:"space-between", alignItems:"center",
    marginTop:24, gap:12,
  },
  navBtn: {
    background:"#0f172a", border:"1px solid #1e293b", color:"#64748b",
    padding:"10px 18px", borderRadius:8, cursor:"pointer", fontSize:13,
    transition:"opacity 0.2s",
  },
  analizBtn: {
    background:"#4ade80", border:"none", color:"#052e16",
    padding:"13px 28px", borderRadius:10, cursor:"pointer",
    fontSize:14, fontWeight:800, letterSpacing:1,
  },
  sonucKap: {
    maxWidth:640, width:"100%", paddingBottom:60,
    display:"flex", flexDirection:"column", gap:20,
  },
  sonucBaslikBlok: {
    textAlign:"center", paddingTop:32,
  },
  profilAdi: {
    fontSize:34, fontWeight:800, letterSpacing:4, margin:"0 0 12px",
  },
  matrisEtiket: {
    display:"inline-block", padding:"6px 16px", borderRadius:20,
    fontSize:13, lineHeight:1.5,
  },
  genelSkorBlok: {
    display:"flex", justifyContent:"center", gap:32,
  },
  skorKutu: {
    textAlign:"center",
  },
  bolum: {
    background:"#0a0f1a", border:"1px solid #1e293b",
    borderRadius:16, padding:"18px 18px 14px",
  },
  bolumBaslik: {
    color:"#4ade80", fontSize:11, fontWeight:800, letterSpacing:2,
    marginBottom:14,
  },
  boyutSatir: {
    marginBottom:14,
  },
  cubukAlt: {
    height:6, background:"#1e293b", borderRadius:3, overflow:"hidden",
  },
  cubukDolu: {
    height:"100%", borderRadius:3, transition:"width 1s ease",
  },
  ikiSutun: {
    display:"flex", gap:12, flexWrap:"wrap",
  },
  madde: {
    color:"#94a3b8", fontSize:13, padding:"7px 0",
    borderBottom:"1px solid", lineHeight:1.5,
  },
  matrisGrid: {
    display:"grid", gridTemplateColumns:"1fr 1fr", gap:10,
  },
  matrisHucre: {
    padding:"14px", borderRadius:10, textAlign:"center",
    display:"flex", flexDirection:"column", alignItems:"center", gap:4,
    minHeight:60, justifyContent:"center",
  },
};
