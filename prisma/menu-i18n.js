/**
 * Resto — menyu tarjimalari (ruscha asos → o'zbekcha va inglizcha).
 *
 * Asl menyu rus tilida. Bu faylda har bir kategoriya, taom nomi va
 * tarkib uchun o'zbekcha hamda inglizcha varianti saqlanadi.
 * Yangi taom qo'shsangiz, tarjimasini ham shu yerga yozing —
 * bo'lmasa ruscha varianti ko'rsatiladi.
 */

/** Kategoriya nomlari */
export const CATEGORIES = {
  "Мезе–Стартеры": {
    "uz": "Mezelar",
    "en": "Meze & Starters"
  },
  "Закуски": {
    "uz": "Gazaklar",
    "en": "Appetizers"
  },
  "Салаты": {
    "uz": "Salatlar",
    "en": "Salads"
  },
  "Супы": {
    "uz": "Sho'rvalar",
    "en": "Soups"
  },
  "Паста": {
    "uz": "Pasta",
    "en": "Pasta"
  },
  "Блюда в тандыре": {
    "uz": "Tandir taomlari",
    "en": "Tandoor Dishes"
  },
  "Шашлыки": {
    "uz": "Kaboblar",
    "en": "Kebabs"
  },
  "Стейки": {
    "uz": "Steyklar",
    "en": "Steaks"
  },
  "Бургеры": {
    "uz": "Burgerlar",
    "en": "Burgers"
  },
  "Show-блюда": {
    "uz": "Show-taomlar",
    "en": "Show Dishes"
  },
  "Теппан": {
    "uz": "Teppan",
    "en": "Teppan"
  },
  "Японские закуски": {
    "uz": "Yapon gazaklari",
    "en": "Japanese Appetizers"
  },
  "Роллы": {
    "uz": "Rollar",
    "en": "Rolls"
  },
  "Горячие роллы": {
    "uz": "Issiq rollar",
    "en": "Hot Rolls"
  },
  "Маки": {
    "uz": "Maki",
    "en": "Maki"
  },
  "Гункан": {
    "uz": "Gunkan",
    "en": "Gunkan"
  },
  "Нигири": {
    "uz": "Nigiri",
    "en": "Nigiri"
  },
  "Сашими": {
    "uz": "Sashimi",
    "en": "Sashimi"
  },
  "Кофе": {
    "uz": "Kofe",
    "en": "Coffee"
  },
  "Коктейли": {
    "uz": "Kokteyllar",
    "en": "Cocktails"
  },
  "Горячие коктейли": {
    "uz": "Issiq kokteyllar",
    "en": "Hot Cocktails"
  },
  "Авторские напитки": {
    "uz": "Mualliflik ichimliklar",
    "en": "Signature Drinks"
  },
  "Лимонады": {
    "uz": "Limonadlar",
    "en": "Lemonades"
  },
  "Свежевыжатые соки": {
    "uz": "Yangi siqilgan sharbatlar",
    "en": "Fresh Juices"
  },
  "Спешл чай": {
    "uz": "Maxsus choylar",
    "en": "Special Tea"
  }
};

/** Taom nomlari (hajm qo'shimchasisiz: "450 ml", "1 L" avtomatik qo'shiladi) */
export const DISH_NAMES = {
  "Ачил Эзме": {
    "uz": "Achil Ezme",
    "en": "Acili Ezme"
  },
  "Хайдари": {
    "uz": "Haydari",
    "en": "Haydari"
  },
  "Хумус": {
    "uz": "Hummus",
    "en": "Hummus"
  },
  "Хоровац": {
    "uz": "Horovats",
    "en": "Horovats"
  },
  "Шакшука": {
    "uz": "Shakshuka",
    "en": "Shakshuka"
  },
  "Хавуч Таратур": {
    "uz": "Havuch Taratur",
    "en": "Havuc Tarator"
  },
  "Сюзмали Мантар": {
    "uz": "Suzmali Mantar",
    "en": "Suzmeli Mantar"
  },
  "Мевсим Себзелери": {
    "uz": "Mavsumiy sabzavotlar",
    "en": "Seasonal Vegetables"
  },
  "Пембе Султан": {
    "uz": "Pembe Sulton",
    "en": "Pembe Sultan"
  },
  "Ассорти Мезе": {
    "uz": "Meze assortisi",
    "en": "Meze Platter"
  },
  "Сэндвич от шефа": {
    "uz": "Shef sendvichi",
    "en": "Chef's Sandwich"
  },
  "Креветки с ореховым соусом": {
    "uz": "Yong'oqli sousdagi krevetka",
    "en": "Shrimp in Nut Sauce"
  },
  "Хумус с говяжьей вырезкой": {
    "uz": "Mol go'shtli hummus",
    "en": "Hummus with Beef Tenderloin"
  },
  "Язык из телятины с пюре айоли": {
    "uz": "Ayoli pyuresi bilan buzoq tili",
    "en": "Veal Tongue with Aioli Puree"
  },
  "Кесадилья с говяжьим фаршем": {
    "uz": "Mol go'shtli kesadilya",
    "en": "Beef Quesadilla"
  },
  "Чобан": {
    "uz": "Cho'pon salati",
    "en": "Coban Salad"
  },
  "Хрустящие баклажаны": {
    "uz": "Qarsildoq baqlajon",
    "en": "Crispy Eggplant"
  },
  "Салат с бон-филе и овощами": {
    "uz": "Bon-file va sabzavotli salat",
    "en": "Beef Tenderloin & Vegetable Salad"
  },
  "Буррата": {
    "uz": "Burrata",
    "en": "Burrata"
  },
  "Цезарь Романо": {
    "uz": "Sezar Romano",
    "en": "Caesar Romano"
  },
  "Салат с муссом авокадо и моцареллой бейби": {
    "uz": "Avokado mussi va beybi motsarella salati",
    "en": "Avocado Mousse & Baby Mozzarella Salad"
  },
  "Финский суп": {
    "uz": "Fin sho'rvasi",
    "en": "Finnish Soup"
  },
  "Куриный суп": {
    "uz": "Tovuq sho'rvasi",
    "en": "Chicken Soup"
  },
  "Эзогелин": {
    "uz": "Ezogelin",
    "en": "Ezogelin"
  },
  "Чечевичный": {
    "uz": "Yasmiq sho'rvasi",
    "en": "Lentil Soup"
  },
  "Том-ям с морепродуктами": {
    "uz": "Dengiz mahsulotli Tom Yam",
    "en": "Tom Yum with Seafood"
  },
  "Том-ям с курицей": {
    "uz": "Tovuqli Tom Yam",
    "en": "Tom Yum with Chicken"
  },
  "Борщ": {
    "uz": "Borsh",
    "en": "Borscht"
  },
  "Мастава": {
    "uz": "Mastava",
    "en": "Mastava"
  },
  "Мисо": {
    "uz": "Miso",
    "en": "Miso"
  },
  "Тыквенный крабовый суп": {
    "uz": "Qovoqli-qisqichbaqali sho'rva",
    "en": "Pumpkin Crab Soup"
  },
  "Болоньезе": {
    "uz": "Bolonez",
    "en": "Bolognese"
  },
  "Лингуини с морепродуктами": {
    "uz": "Dengiz mahsulotli linguini",
    "en": "Linguine with Seafood"
  },
  "Паста Карбонара": {
    "uz": "Karbonara pastasi",
    "en": "Pasta Carbonara"
  },
  "Аррабьята со страчателлой": {
    "uz": "Strachatellali arrabyata",
    "en": "Arrabbiata with Stracciatella"
  },
  "Альфредо со страчателлой": {
    "uz": "Strachatellali alfredo",
    "en": "Alfredo with Stracciatella"
  },
  "Пицца Пепперони": {
    "uz": "Peperoni pitsa",
    "en": "Pepperoni Pizza"
  },
  "Пицца Маргарита": {
    "uz": "Margarita pitsa",
    "en": "Margherita Pizza"
  },
  "Кушбаши Пиде": {
    "uz": "Kushboshi Pide",
    "en": "Kusbasi Pide"
  },
  "Ассорти Пиде": {
    "uz": "Pide assortisi",
    "en": "Mixed Pide"
  },
  "Пицца с курицей и грибами": {
    "uz": "Tovuq va qo'ziqorinli pitsa",
    "en": "Chicken & Mushroom Pizza"
  },
  "Пицца с трюфельной пастой и страчателлой": {
    "uz": "Tryufel va strachatellali pitsa",
    "en": "Truffle & Stracciatella Pizza"
  },
  "Филе телёнка": {
    "uz": "Buzoq filesi",
    "en": "Veal Fillet"
  },
  "Урфа кебаб": {
    "uz": "Urfa kabob",
    "en": "Urfa Kebab"
  },
  "Адана кебаб": {
    "uz": "Adana kabob",
    "en": "Adana Kebab"
  },
  "Микс шашлыков на 2 персоны": {
    "uz": "Kabob miksi (2 kishiga)",
    "en": "Mixed Kebabs for 2"
  },
  "Микс шашлыков на 4 персоны": {
    "uz": "Kabob miksi (4 kishiga)",
    "en": "Mixed Kebabs for 4"
  },
  "Кебаб из крылышек": {
    "uz": "Qanotcha kabob",
    "en": "Chicken Wing Kebab"
  },
  "Куриный кебаб с сыром": {
    "uz": "Pishloqli tovuq kabob",
    "en": "Chicken Kebab with Cheese"
  },
  "Бейти кебаб": {
    "uz": "Beyti kabob",
    "en": "Beyti Kebab"
  },
  "Стейк Ти-Бон": {
    "uz": "Ti-Bon steyk",
    "en": "T-Bone Steak"
  },
  "Стейк Даллас": {
    "uz": "Dallas steyk",
    "en": "Dallas Steak"
  },
  "Нью-Йорк стейк": {
    "uz": "Nyu-York steyk",
    "en": "New York Steak"
  },
  "Стейк Рибай": {
    "uz": "Ribay steyk",
    "en": "Ribeye Steak"
  },
  "Классик бургер": {
    "uz": "Klassik burger",
    "en": "Classic Burger"
  },
  "Стейк-бургер": {
    "uz": "Steyk-burger",
    "en": "Steak Burger"
  },
  "Чизбургер": {
    "uz": "Chizburger",
    "en": "Cheeseburger"
  },
  "Мясной сет": {
    "uz": "Go'sht seti",
    "en": "Meat Set"
  },
  "Форель в соли": {
    "uz": "Tuzdagi gulmohi",
    "en": "Trout in Salt"
  },
  "Целая баранья корейка": {
    "uz": "Butun qo'zi qovurg'asi",
    "en": "Whole Lamb Loin"
  },
  "Баранья лопатка в тандыре": {
    "uz": "Tandirdagi qo'zi kuragi",
    "en": "Lamb Shoulder in Tandoor"
  },
  "Шатобриан": {
    "uz": "Shatobrian",
    "en": "Chateaubriand"
  },
  "Овощи на теппане": {
    "uz": "Teppandagi sabzavotlar",
    "en": "Vegetables on Teppan"
  },
  "Спаржа": {
    "uz": "Sparja",
    "en": "Asparagus"
  },
  "Удон с курицей": {
    "uz": "Tovuqli udon",
    "en": "Udon with Chicken"
  },
  "Удон с креветками": {
    "uz": "Krevetkali udon",
    "en": "Udon with Shrimp"
  },
  "Говяжья вырезка на теппане": {
    "uz": "Teppandagi mol go'shti bon-filesi",
    "en": "Beef Tenderloin on Teppan"
  },
  "Курица терияки": {
    "uz": "Teriyaki tovuq",
    "en": "Teriyaki Chicken"
  },
  "Корейка на теппане": {
    "uz": "Teppandagi qo'zi qovurg'asi",
    "en": "Lamb Loin on Teppan"
  },
  "Лосось с соусом терияки": {
    "uz": "Teriyaki sousli losos",
    "en": "Salmon with Teriyaki Sauce"
  },
  "Креветки на теппане": {
    "uz": "Teppandagi krevetka",
    "en": "Shrimp on Teppan"
  },
  "Вагю А5": {
    "uz": "Vagyu A5",
    "en": "Wagyu A5"
  },
  "Лобстер": {
    "uz": "Lobster",
    "en": "Lobster"
  },
  "Рыба от шефа (дорадо)": {
    "uz": "Shef baliqi (dorado)",
    "en": "Chef's Fish (Dorado)"
  },
  "Рыба от шефа (сибас)": {
    "uz": "Shef baliqi (sibas)",
    "en": "Chef's Fish (Sea Bass)"
  },
  "Тяхан с овощами": {
    "uz": "Sabzavotli tyaxan",
    "en": "Chahan with Vegetables"
  },
  "Фаланга краба": {
    "uz": "Qisqichbaqa oyog'i",
    "en": "King Crab Leg"
  },
  "Краб камчатский": {
    "uz": "Kamchatka qisqichbaqasi",
    "en": "King Crab"
  },
  "Чука": {
    "uz": "Chuka",
    "en": "Chuka Salad"
  },
  "Эдамаме": {
    "uz": "Edamame",
    "en": "Edamame"
  },
  "Устрица на гриле": {
    "uz": "Grildagi ustritsa",
    "en": "Grilled Oyster"
  },
  "Креветка темпура": {
    "uz": "Tempura krevetka",
    "en": "Shrimp Tempura"
  },
  "Устрицы Жилардо": {
    "uz": "Jilardo ustritsasi",
    "en": "Gillardeau Oysters"
  },
  "Тартар из лосося": {
    "uz": "Losos tartari",
    "en": "Salmon Tartare"
  },
  "Филадельфия": {
    "uz": "Filadelfiya",
    "en": "Philadelphia"
  },
  "Канада": {
    "uz": "Kanada",
    "en": "Canada"
  },
  "Калифорния": {
    "uz": "Kaliforniya",
    "en": "California"
  },
  "Калифорния Саке": {
    "uz": "Kaliforniya Sake",
    "en": "California Sake"
  },
  "Ресто Ролл": {
    "uz": "Resto Roll",
    "en": "Resto Roll"
  },
  "Филадельфия Классик": {
    "uz": "Filadelfiya Klassik",
    "en": "Philadelphia Classic"
  },
  "Вагю Ролл": {
    "uz": "Vagyu Roll",
    "en": "Wagyu Roll"
  },
  "Темпура Лосось": {
    "uz": "Tempura Losos",
    "en": "Tempura Salmon"
  },
  "Абури Ролл": {
    "uz": "Aburi Roll",
    "en": "Aburi Roll"
  },
  "Запечённый Саке": {
    "uz": "Pishirilgan Sake",
    "en": "Baked Sake"
  },
  "Запечённый Угорь": {
    "uz": "Pishirilgan Ilonbaliq",
    "en": "Baked Eel"
  },
  "Роял Салмон": {
    "uz": "Royal Salmon",
    "en": "Royal Salmon"
  },
  "Спайси Саке": {
    "uz": "Spaysi Sake",
    "en": "Spicy Sake"
  },
  "Запечённая Филадельфия": {
    "uz": "Pishirilgan Filadelfiya",
    "en": "Baked Philadelphia"
  },
  "Дракон Темпура": {
    "uz": "Drakon Tempura",
    "en": "Dragon Tempura"
  },
  "Абури Мясной": {
    "uz": "Go'shtli Aburi",
    "en": "Aburi Meat"
  },
  "Саке Маки": {
    "uz": "Sake Maki",
    "en": "Sake Maki"
  },
  "Тунец Маки": {
    "uz": "Tunets Maki",
    "en": "Tuna Maki"
  },
  "Унаги Маки": {
    "uz": "Unagi Maki",
    "en": "Unagi Maki"
  },
  "Каппа Маки": {
    "uz": "Kappa Maki",
    "en": "Kappa Maki"
  },
  "Авокадо Маки": {
    "uz": "Avokado Maki",
    "en": "Avocado Maki"
  },
  "Гункан Саке": {
    "uz": "Sake Gunkan",
    "en": "Sake Gunkan"
  },
  "Гункан Чука": {
    "uz": "Chuka Gunkan",
    "en": "Chuka Gunkan"
  },
  "Нигири Саке": {
    "uz": "Sake Nigiri",
    "en": "Sake Nigiri"
  },
  "Нигири Тунец": {
    "uz": "Tunets Nigiri",
    "en": "Tuna Nigiri"
  },
  "Нигири Вагю": {
    "uz": "Vagyu Nigiri",
    "en": "Wagyu Nigiri"
  },
  "Нигири Тунец Оторо": {
    "uz": "Otoro Tunets Nigiri",
    "en": "Otoro Tuna Nigiri"
  },
  "Нигири Креветка": {
    "uz": "Krevetka Nigiri",
    "en": "Shrimp Nigiri"
  },
  "Нигири Унаги": {
    "uz": "Unagi Nigiri",
    "en": "Unagi Nigiri"
  },
  "Сет Нигири": {
    "uz": "Nigiri seti",
    "en": "Nigiri Set"
  },
  "Сашими Лосось": {
    "uz": "Losos Sashimi",
    "en": "Salmon Sashimi"
  },
  "Сашими Креветка": {
    "uz": "Krevetka Sashimi",
    "en": "Shrimp Sashimi"
  },
  "Тунец Аками": {
    "uz": "Akami Tunets",
    "en": "Akami Tuna"
  },
  "Тунец Оторо": {
    "uz": "Otoro Tunets",
    "en": "Otoro Tuna"
  },
  "Сашими Унаги": {
    "uz": "Unagi Sashimi",
    "en": "Unagi Sashimi"
  },
  "Сашими Сет": {
    "uz": "Sashimi seti",
    "en": "Sashimi Set"
  },
  "Эспрессо": {
    "uz": "Espresso",
    "en": "Espresso"
  },
  "Доппио": {
    "uz": "Doppio",
    "en": "Doppio"
  },
  "Американо": {
    "uz": "Amerikano",
    "en": "Americano"
  },
  "Декаф (без кофеина)": {
    "uz": "Dekaf (kofeinsiz)",
    "en": "Decaf"
  },
  "Капучино": {
    "uz": "Kapuchino",
    "en": "Cappuccino"
  },
  "Капучино (без кофеина)": {
    "uz": "Kapuchino (kofeinsiz)",
    "en": "Cappuccino (Decaf)"
  },
  "Латте": {
    "uz": "Latte",
    "en": "Latte"
  },
  "Флэт Уайт": {
    "uz": "Flet Uayt",
    "en": "Flat White"
  },
  "Раф карамельный": {
    "uz": "Karamelli Raf",
    "en": "Caramel Raf"
  },
  "Турецкий кофе": {
    "uz": "Turk kofesi",
    "en": "Turkish Coffee"
  },
  "Мохито": {
    "uz": "Mohito",
    "en": "Mojito"
  },
  "Candy Garden": {
    "uz": "Candy Garden",
    "en": "Candy Garden"
  },
  "Vanilla Mango": {
    "uz": "Vanilla Mango",
    "en": "Vanilla Mango"
  },
  "Pink Tonic": {
    "uz": "Pink Tonic",
    "en": "Pink Tonic"
  },
  "Banana Cloud": {
    "uz": "Banana Cloud",
    "en": "Banana Cloud"
  },
  "Salted Palm": {
    "uz": "Salted Palm",
    "en": "Salted Palm"
  },
  "Солёная фисташка": {
    "uz": "Sho'r pista",
    "en": "Salted Pistachio"
  },
  "Какао": {
    "uz": "Kakao",
    "en": "Cocoa"
  },
  "Горячий шоколад": {
    "uz": "Issiq shokolad",
    "en": "Hot Chocolate"
  },
  "Айсти": {
    "uz": "Aysti",
    "en": "Iced Tea"
  },
  "Айран": {
    "uz": "Ayron",
    "en": "Ayran"
  },
  "Вишнёвый компот": {
    "uz": "Olcha komposti",
    "en": "Cherry Compote"
  },
  "Шиповник": {
    "uz": "Namatak",
    "en": "Rosehip"
  },
  "Кисло-сладкий юдзу-яблоко": {
    "uz": "Nordon-shirin yudzu-olma",
    "en": "Sweet & Sour Yuzu-Apple"
  },
  "Ягодный персик": {
    "uz": "Rezavorli shaftoli",
    "en": "Berry Peach"
  },
  "Крем сода": {
    "uz": "Krem soda",
    "en": "Cream Soda"
  },
  "Тропический манго": {
    "uz": "Tropik mango",
    "en": "Tropical Mango"
  },
  "Гранатовый сок": {
    "uz": "Anor sharbati",
    "en": "Pomegranate Juice"
  },
  "Яблочный сок": {
    "uz": "Olma sharbati",
    "en": "Apple Juice"
  },
  "Морковный сок": {
    "uz": "Sabzi sharbati",
    "en": "Carrot Juice"
  },
  "Апельсиновый сок": {
    "uz": "Apelsin sharbati",
    "en": "Orange Juice"
  },
  "Детокс": {
    "uz": "Detoks",
    "en": "Detox"
  },
  "Лесные ягоды": {
    "uz": "O'rmon rezavorlari",
    "en": "Forest Berries"
  },
  "Цитрус-имбирь с маракуйей": {
    "uz": "Sitrus-zanjabil va marakuyya",
    "en": "Citrus-Ginger with Passion Fruit"
  },
  "Персиковая сакура": {
    "uz": "Shaftolili sakura",
    "en": "Peach Sakura"
  },
  "Тропический чай с гуавой": {
    "uz": "Guavali tropik choy",
    "en": "Tropical Tea with Guava"
  }
};

/** Tarkib so'zlari */
export const INGREDIENTS = {
  "Томаты": {
    "uz": "Pomidor",
    "en": "Tomatoes"
  },
  "Огурцы": {
    "uz": "Bodring",
    "en": "Cucumbers"
  },
  "Паприка": {
    "uz": "Paprika",
    "en": "Paprika"
  },
  "Лук": {
    "uz": "Piyoz",
    "en": "Onion"
  },
  "Чеснок": {
    "uz": "Sarimsoq",
    "en": "Garlic"
  },
  "Сузьма": {
    "uz": "Suzma",
    "en": "Suzma"
  },
  "Сливки": {
    "uz": "Qaymoq",
    "en": "Cream"
  },
  "Баклажан": {
    "uz": "Baqlajon",
    "en": "Eggplant"
  },
  "Мята": {
    "uz": "Yalpiz",
    "en": "Mint"
  },
  "Нут": {
    "uz": "No'xat",
    "en": "Chickpeas"
  },
  "Тахина": {
    "uz": "Tahina",
    "en": "Tahini"
  },
  "Баклажаны": {
    "uz": "Baqlajon",
    "en": "Eggplants"
  },
  "Болгарский триколор": {
    "uz": "Uch rangli bulgor qalampiri",
    "en": "Tricolor bell pepper"
  },
  "Лук белый": {
    "uz": "Oq piyoz",
    "en": "White onion"
  },
  "Паста томатная": {
    "uz": "Tomat pastasi",
    "en": "Tomato paste"
  },
  "Розовые помидоры": {
    "uz": "Pushti pomidor",
    "en": "Pink tomatoes"
  },
  "Морковь": {
    "uz": "Sabzi",
    "en": "Carrot"
  },
  "Лабне сыр": {
    "uz": "Labne pishlog'i",
    "en": "Labneh cheese"
  },
  "Греческий йогурт": {
    "uz": "Grek yogurti",
    "en": "Greek yogurt"
  },
  "Шпинат": {
    "uz": "Ismaloq",
    "en": "Spinach"
  },
  "Грибы шампиньоны": {
    "uz": "Shampinon qo'ziqorini",
    "en": "Champignon mushrooms"
  },
  "Сюзма": {
    "uz": "Suzma",
    "en": "Suzma"
  },
  "Лабне": {
    "uz": "Labne",
    "en": "Labneh"
  },
  "Брокколи": {
    "uz": "Brokkoli",
    "en": "Broccoli"
  },
  "Цветная капуста": {
    "uz": "Gulkaram",
    "en": "Cauliflower"
  },
  "Кабачки": {
    "uz": "Qovoqcha",
    "en": "Zucchini"
  },
  "Шампиньоны": {
    "uz": "Shampinon",
    "en": "Champignons"
  },
  "Черри помидоры": {
    "uz": "Cherri pomidor",
    "en": "Cherry tomatoes"
  },
  "Красная капуста": {
    "uz": "Qizil karam",
    "en": "Red cabbage"
  },
  "Карамелизованный лук": {
    "uz": "Karamellangan piyoz",
    "en": "Caramelized onion"
  },
  "Сузьма лабне": {
    "uz": "Suzma labne",
    "en": "Suzma labneh"
  },
  "Хоровац": {
    "uz": "Horovats",
    "en": "Horovats"
  },
  "Шакшука": {
    "uz": "Shakshuka",
    "en": "Shakshuka"
  },
  "Хавуч таратур": {
    "uz": "Havuch taratur",
    "en": "Havuc tarator"
  },
  "Сюзмали мантар": {
    "uz": "Suzmali mantar",
    "en": "Suzmeli mantar"
  },
  "Мевсем себзелере": {
    "uz": "Mavsumiy sabzavotlar",
    "en": "Seasonal vegetables"
  },
  "Пембе султан": {
    "uz": "Pembe sulton",
    "en": "Pembe sultan"
  },
  "Булочка бриошь": {
    "uz": "Brioş bulochkasi",
    "en": "Brioche bun"
  },
  "Пикантный томатный соус": {
    "uz": "Achchiq tomat sousi",
    "en": "Spicy tomato sauce"
  },
  "Майонез": {
    "uz": "Mayonez",
    "en": "Mayonnaise"
  },
  "Лук-шалот": {
    "uz": "Shalot piyozi",
    "en": "Shallot"
  },
  "Бон-филе": {
    "uz": "Bon-file",
    "en": "Beef tenderloin"
  },
  "Сыр моцарелла": {
    "uz": "Motsarella pishlog'i",
    "en": "Mozzarella cheese"
  },
  "Креветки в панировке": {
    "uz": "Panirovkadagi krevetka",
    "en": "Breaded shrimp"
  },
  "Свежий микс-салат": {
    "uz": "Yangi miks salat",
    "en": "Fresh mixed salad"
  },
  "Огурцы кимчи": {
    "uz": "Kimchi bodringi",
    "en": "Kimchi cucumbers"
  },
  "Ореховый соус": {
    "uz": "Yong'oqli souz",
    "en": "Nut sauce"
  },
  "Классический хумус": {
    "uz": "Klassik hummus",
    "en": "Classic hummus"
  },
  "Мусс из авокадо": {
    "uz": "Avokado mussi",
    "en": "Avocado mousse"
  },
  "Говяжья вырезка на палочке": {
    "uz": "Tayoqchadagi mol go'shti",
    "en": "Beef tenderloin on a skewer"
  },
  "Прованские травы": {
    "uz": "Provans o'tlari",
    "en": "Herbes de Provence"
  },
  "Лайм": {
    "uz": "Laym",
    "en": "Lime"
  },
  "Томлёный язык": {
    "uz": "Dimlangan til",
    "en": "Braised tongue"
  },
  "Соус демиглас": {
    "uz": "Demiglas sousi",
    "en": "Demi-glace sauce"
  },
  "Зернистая горчица": {
    "uz": "Donador xantal",
    "en": "Grain mustard"
  },
  "Натуральный мёд": {
    "uz": "Tabiiy asal",
    "en": "Natural honey"
  },
  "Говяжий фарш": {
    "uz": "Mol go'shti qiymasi",
    "en": "Ground beef"
  },
  "Лук маринованный": {
    "uz": "Marinadlangan piyoz",
    "en": "Pickled onion"
  },
  "Соус томатный": {
    "uz": "Tomat sousi",
    "en": "Tomato sauce"
  },
  "Кинза": {
    "uz": "Kashnich",
    "en": "Cilantro"
  },
  "Помидоры": {
    "uz": "Pomidor",
    "en": "Tomatoes"
  },
  "Зелень и лук": {
    "uz": "Ko'katlar va piyoz",
    "en": "Herbs and onion"
  },
  "Соус наршараб": {
    "uz": "Narsharab sousi",
    "en": "Narsharab sauce"
  },
  "Лимон": {
    "uz": "Limon",
    "en": "Lemon"
  },
  "Обжаренные баклажаны": {
    "uz": "Qovurilgan baqlajon",
    "en": "Fried eggplant"
  },
  "Кисло-сладкая заправка": {
    "uz": "Nordon-shirin souz",
    "en": "Sweet and sour dressing"
  },
  "Руккола": {
    "uz": "Rukkola",
    "en": "Arugula"
  },
  "Оливки таджарские": {
    "uz": "Tadjaska zaytuni",
    "en": "Taggiasca olives"
  },
  "Перец рамиро": {
    "uz": "Ramiro qalampiri",
    "en": "Ramiro pepper"
  },
  "Айсберг": {
    "uz": "Aysberg",
    "en": "Iceberg lettuce"
  },
  "Универсальный соус": {
    "uz": "Universal souz",
    "en": "House sauce"
  },
  "Буррата": {
    "uz": "Burrata",
    "en": "Burrata"
  },
  "Хлеб бриошь": {
    "uz": "Brioş noni",
    "en": "Brioche bread"
  },
  "Томаты черри": {
    "uz": "Cherri pomidor",
    "en": "Cherry tomatoes"
  },
  "Бальзамический крем": {
    "uz": "Balzamik krem",
    "en": "Balsamic cream"
  },
  "Листья романо": {
    "uz": "Romano barglari",
    "en": "Romaine leaves"
  },
  "Классический соус цезарь": {
    "uz": "Klassik sezar sousi",
    "en": "Classic Caesar dressing"
  },
  "Цыплёнок су-вид": {
    "uz": "Su-vid tovuq",
    "en": "Sous-vide chicken"
  },
  "Микс салата": {
    "uz": "Salat miksi",
    "en": "Mixed greens"
  },
  "Мусс авокадо": {
    "uz": "Avokado mussi",
    "en": "Avocado mousse"
  },
  "Моцарелла бейби": {
    "uz": "Beybi motsarella",
    "en": "Baby mozzarella"
  },
  "Оливковое масло": {
    "uz": "Zaytun moyi",
    "en": "Olive oil"
  },
  "Фрикадельки из лосося": {
    "uz": "Losos kotletchalari",
    "en": "Salmon meatballs"
  },
  "Картофель": {
    "uz": "Kartoshka",
    "en": "Potato"
  },
  "Рыбный бульон": {
    "uz": "Baliq bulyoni",
    "en": "Fish broth"
  },
  "Куриный бульон": {
    "uz": "Tovuq bulyoni",
    "en": "Chicken broth"
  },
  "Домашняя лапша": {
    "uz": "Uyda tayyorlangan ugra",
    "en": "Homemade noodles"
  },
  "Перепелиное яйцо": {
    "uz": "Bedana tuxumi",
    "en": "Quail egg"
  },
  "Чечевица": {
    "uz": "Yasmiq",
    "en": "Lentils"
  },
  "Специи": {
    "uz": "Ziravorlar",
    "en": "Spices"
  },
  "Пикантный бульон": {
    "uz": "Achchiq bulyon",
    "en": "Spicy broth"
  },
  "Классический турецкий суп": {
    "uz": "Klassik turk sho'rvasi",
    "en": "Classic Turkish soup"
  },
  "Пикантный тайский суп": {
    "uz": "Achchiq tay sho'rvasi",
    "en": "Spicy Thai soup"
  },
  "Морепродукты": {
    "uz": "Dengiz mahsulotlari",
    "en": "Seafood"
  },
  "Подаётся с рисом": {
    "uz": "Guruch bilan beriladi",
    "en": "Served with rice"
  },
  "Курица": {
    "uz": "Tovuq",
    "en": "Chicken"
  },
  "Говяжий бульон": {
    "uz": "Mol go'shti bulyoni",
    "en": "Beef broth"
  },
  "Овощи и капуста": {
    "uz": "Sabzavot va karam",
    "en": "Vegetables and cabbage"
  },
  "Копчёная сметана": {
    "uz": "Dudlangan smetana",
    "en": "Smoked sour cream"
  },
  "Запечённая говядина": {
    "uz": "Pishirilgan mol go'shti",
    "en": "Roasted beef"
  },
  "Говядина и баранина": {
    "uz": "Mol va qo'y go'shti",
    "en": "Beef and lamb"
  },
  "Рис": {
    "uz": "Guruch",
    "en": "Rice"
  },
  "Помидоры, морковь, картофель": {
    "uz": "Pomidor, sabzi, kartoshka",
    "en": "Tomatoes, carrot, potato"
  },
  "Паприка свежая": {
    "uz": "Yangi paprika",
    "en": "Fresh paprika"
  },
  "Стручковый перец": {
    "uz": "Qalampir",
    "en": "Chili pepper"
  },
  "Сельдерей": {
    "uz": "Selderey",
    "en": "Celery"
  },
  "Кефир": {
    "uz": "Kefir",
    "en": "Kefir"
  },
  "Лосось": {
    "uz": "Losos",
    "en": "Salmon"
  },
  "Тофу": {
    "uz": "Tofu",
    "en": "Tofu"
  },
  "Вакаме": {
    "uz": "Vakame",
    "en": "Wakame"
  },
  "Кунжут": {
    "uz": "Kunjut",
    "en": "Sesame"
  },
  "Зелёный лук": {
    "uz": "Ko'k piyoz",
    "en": "Green onion"
  },
  "Тыква": {
    "uz": "Qovoq",
    "en": "Pumpkin"
  },
  "Краб": {
    "uz": "Qisqichbaqa",
    "en": "Crab"
  },
  "Топлёное масло": {
    "uz": "Sariyog'",
    "en": "Ghee"
  },
  "Спагетти": {
    "uz": "Spagetti",
    "en": "Spaghetti"
  },
  "Фарш из говядины": {
    "uz": "Mol go'shti qiymasi",
    "en": "Ground beef"
  },
  "Густой томатный соус": {
    "uz": "Quyuq tomat sousi",
    "en": "Thick tomato sauce"
  },
  "Сыр пармезан": {
    "uz": "Parmezan pishlog'i",
    "en": "Parmesan cheese"
  },
  "Паста лингуини": {
    "uz": "Linguini pastasi",
    "en": "Linguine pasta"
  },
  "Томатный соус": {
    "uz": "Tomat sousi",
    "en": "Tomato sauce"
  },
  "Помидоры черри": {
    "uz": "Cherri pomidor",
    "en": "Cherry tomatoes"
  },
  "Мидии": {
    "uz": "Midiya",
    "en": "Mussels"
  },
  "Кальмар": {
    "uz": "Kalmar",
    "en": "Squid"
  },
  "Креветки": {
    "uz": "Krevetka",
    "en": "Shrimp"
  },
  "Сливочно-сырный соус": {
    "uz": "Qaymoqli-pishloqli souz",
    "en": "Creamy cheese sauce"
  },
  "Куриная грудка су-вид": {
    "uz": "Su-vid tovuq ko'kragi",
    "en": "Sous-vide chicken breast"
  },
  "Говяжий бекон": {
    "uz": "Mol go'shti bekoni",
    "en": "Beef bacon"
  },
  "Яичный желток": {
    "uz": "Tuxum sarig'i",
    "en": "Egg yolk"
  },
  "Грана Падано": {
    "uz": "Grana Padano",
    "en": "Grana Padano"
  },
  "Паста пенне": {
    "uz": "Penne pastasi",
    "en": "Penne pasta"
  },
  "Сыр страчателла": {
    "uz": "Strachatella pishlog'i",
    "en": "Stracciatella cheese"
  },
  "Базилик": {
    "uz": "Rayhon",
    "en": "Basil"
  },
  "Феттучини": {
    "uz": "Fettuchini",
    "en": "Fettuccine"
  },
  "Сливочный соус": {
    "uz": "Qaymoqli souz",
    "en": "Cream sauce"
  },
  "Куриное филе": {
    "uz": "Tovuq filesi",
    "en": "Chicken fillet"
  },
  "Тесто": {
    "uz": "Xamir",
    "en": "Dough"
  },
  "Пепперони": {
    "uz": "Peperoni",
    "en": "Pepperoni"
  },
  "Запечённое в тандыре тесто": {
    "uz": "Tandirda pishirilgan xamir",
    "en": "Tandoor-baked dough"
  },
  "Мясо": {
    "uz": "Go'sht",
    "en": "Meat"
  },
  "Овощи": {
    "uz": "Sabzavotlar",
    "en": "Vegetables"
  },
  "Говяжья вырезка": {
    "uz": "Mol go'shti bon-filesi",
    "en": "Beef tenderloin"
  },
  "Сыр кашар": {
    "uz": "Kashar pishlog'i",
    "en": "Kashar cheese"
  },
  "Бастурма": {
    "uz": "Basturma",
    "en": "Basturma"
  },
  "Говяжий донер": {
    "uz": "Mol go'shtli doner",
    "en": "Beef doner"
  },
  "Куриный донер": {
    "uz": "Tovuqli doner",
    "en": "Chicken doner"
  },
  "Начинка лахмаджун": {
    "uz": "Lahmajun qiymasi",
    "en": "Lahmacun filling"
  },
  "Дунганский перец": {
    "uz": "Dungan qalampiri",
    "en": "Dungan pepper"
  },
  "Классический томатный соус": {
    "uz": "Klassik tomat sousi",
    "en": "Classic tomato sauce"
  },
  "Соус bbq": {
    "uz": "BBQ sousi",
    "en": "BBQ sauce"
  },
  "Трюфельный соус": {
    "uz": "Tryufel sousi",
    "en": "Truffle sauce"
  },
  "Сливочно-сырная основа": {
    "uz": "Qaymoqli-pishloqli asos",
    "en": "Creamy cheese base"
  },
  "Страчателла": {
    "uz": "Strachatella",
    "en": "Stracciatella"
  },
  "Отборное филе молодого телёнка": {
    "uz": "Yosh buzoq filesi",
    "en": "Prime young veal fillet"
  },
  "Приготовлено на мангале": {
    "uz": "Mangalda pishirilgan",
    "en": "Grilled over charcoal"
  },
  "Рубленое филе говядины": {
    "uz": "Maydalangan mol go'shti filesi",
    "en": "Minced beef fillet"
  },
  "Филе баранины": {
    "uz": "Qo'y go'shti filesi",
    "en": "Lamb fillet"
  },
  "Думба": {
    "uz": "Dumba",
    "en": "Fat tail"
  },
  "Лук красный": {
    "uz": "Qizil piyoz",
    "en": "Red onion"
  },
  "Лаваш": {
    "uz": "Lavash",
    "en": "Lavash"
  },
  "Перец дунганский": {
    "uz": "Dungan qalampiri",
    "en": "Dungan pepper"
  },
  "Перец пулпибер": {
    "uz": "Pulbiber qalampiri",
    "en": "Pul biber pepper"
  },
  "Куриный кебаб с сыром": {
    "uz": "Pishloqli tovuq kabob",
    "en": "Chicken kebab with cheese"
  },
  "Адана кебаб (острый)": {
    "uz": "Adana kabob (achchiq)",
    "en": "Adana kebab (spicy)"
  },
  "Дана шиш (филе говядины)": {
    "uz": "Dana shish (mol go'shti filesi)",
    "en": "Dana shish (beef fillet)"
  },
  "Канат шиш (крылышки)": {
    "uz": "Kanat shish (qanotcha)",
    "en": "Kanat shish (wings)"
  },
  "Лахмажун": {
    "uz": "Lahmajun",
    "en": "Lahmacun"
  },
  "Корейка ягнёнка": {
    "uz": "Qo'zi qovurg'asi",
    "en": "Lamb loin"
  },
  "Дана шиш": {
    "uz": "Dana shish",
    "en": "Dana shish"
  },
  "Канат шиш": {
    "uz": "Kanat shish",
    "en": "Kanat shish"
  },
  "Куриные крылышки": {
    "uz": "Tovuq qanotchalari",
    "en": "Chicken wings"
  },
  "Обжарены на углях до хрустящей корочки": {
    "uz": "Cho'g'da qarsildoq bo'lguncha qovurilgan",
    "en": "Charcoal-grilled until crispy"
  },
  "Куриное бедро": {
    "uz": "Tovuq soni",
    "en": "Chicken thigh"
  },
  "Рубленый люля-кебаб": {
    "uz": "Maydalangan lyulya-kabob",
    "en": "Minced lula kebab"
  },
  "Соус искандер": {
    "uz": "Iskandar sousi",
    "en": "Iskender sauce"
  },
  "Сюзьма": {
    "uz": "Suzma",
    "en": "Suzma"
  },
  "Перец дунган": {
    "uz": "Dungan qalampiri",
    "en": "Dungan pepper"
  },
  "Фисташки": {
    "uz": "Pista",
    "en": "Pistachios"
  },
  "Сухое вызревание": {
    "uz": "Quruq yetiltirish",
    "en": "Dry-aged"
  },
  "Филе и вырезка на Т-образной кости": {
    "uz": "T-shaklidagi suyakda file va bon-file",
    "en": "Fillet and tenderloin on a T-bone"
  },
  "100 гр": {
    "uz": "100 g",
    "en": "100 g"
  },
  "Мраморная говядина": {
    "uz": "Marmar mol go'shti",
    "en": "Marbled beef"
  },
  "Обжарен до идеальной корочки": {
    "uz": "Mukammal qatlamgacha qovurilgan",
    "en": "Seared to a perfect crust"
  },
  "Благородная текстура": {
    "uz": "Nozik tuzilma",
    "en": "Refined texture"
  },
  "Тонкая мраморность": {
    "uz": "Nozik marmarlik",
    "en": "Fine marbling"
  },
  "Мраморный и ароматный": {
    "uz": "Marmar va xushbo'y",
    "en": "Marbled and aromatic"
  },
  "Котлета из говядины": {
    "uz": "Mol go'shti kotleti",
    "en": "Beef patty"
  },
  "Сыр чеддер": {
    "uz": "Chedder pishlog'i",
    "en": "Cheddar cheese"
  },
  "Фирменный соус": {
    "uz": "Firma sousi",
    "en": "Signature sauce"
  },
  "Картофель фри": {
    "uz": "Fri kartoshka",
    "en": "French fries"
  },
  "Горчица": {
    "uz": "Xantal",
    "en": "Mustard"
  },
  "Кетчуп": {
    "uz": "Ketchup",
    "en": "Ketchup"
  },
  "Каре ягнёнка": {
    "uz": "Qo'zi karesi",
    "en": "Rack of lamb"
  },
  "Адана и урфа кебаб": {
    "uz": "Adana va Urfa kabob",
    "en": "Adana and Urfa kebab"
  },
  "Костный мозг на гриле": {
    "uz": "Grildagi suyak iligi",
    "en": "Grilled bone marrow"
  },
  "Сырный соус": {
    "uz": "Pishloqli souz",
    "en": "Cheese sauce"
  },
  "Форель, запечённая в тандыре": {
    "uz": "Tandirda pishirilgan gulmohi",
    "en": "Tandoor-baked trout"
  },
  "Цельная корейка ягнёнка, запечённая в тандыре": {
    "uz": "Tandirda pishirilgan butun qo'zi qovurg'asi",
    "en": "Whole lamb loin baked in the tandoor"
  },
  "На 4 персоны": {
    "uz": "4 kishiga",
    "en": "Serves 4"
  },
  "1.5 кг в сыром виде": {
    "uz": "Xom holda 1.5 kg",
    "en": "1.5 kg raw"
  },
  "Цельная лопатка ягнёнка, запечённая в тандыре": {
    "uz": "Tandirda pishirilgan butun qo'zi kuragi",
    "en": "Whole lamb shoulder baked in the tandoor"
  },
  "1.9 кг в сыром виде": {
    "uz": "Xom holda 1.9 kg",
    "en": "1.9 kg raw"
  },
  "Черри": {
    "uz": "Cherri pomidor",
    "en": "Cherry tomatoes"
  },
  "Сыр": {
    "uz": "Pishloq",
    "en": "Cheese"
  },
  "Багет": {
    "uz": "Baget",
    "en": "Baguette"
  },
  "На 2 персоны": {
    "uz": "2 kishiga",
    "en": "Serves 2"
  },
  "0.5 кг в сыром виде": {
    "uz": "Xom holda 0.5 kg",
    "en": "0.5 kg raw"
  },
  "Болгарский перец": {
    "uz": "Bulgor qalampiri",
    "en": "Bell pepper"
  },
  "Кабачок": {
    "uz": "Qovoqcha",
    "en": "Zucchini"
  },
  "Спаржа в сливочном соусе": {
    "uz": "Qaymoqli sousdagi sparja",
    "en": "Asparagus in cream sauce"
  },
  "Лапша": {
    "uz": "Ugra",
    "en": "Noodles"
  },
  "Устричный соус": {
    "uz": "Ustritsa sousi",
    "en": "Oyster sauce"
  },
  "Терияки соус": {
    "uz": "Teriyaki sousi",
    "en": "Teriyaki sauce"
  },
  "Вырезка": {
    "uz": "Bon-file",
    "en": "Tenderloin"
  },
  "Сладкий соус": {
    "uz": "Shirin souz",
    "en": "Sweet sauce"
  },
  "Тигровые креветки": {
    "uz": "Yo'lbars krevetkasi",
    "en": "Tiger prawns"
  },
  "Сливочно-чесночный соус": {
    "uz": "Qaymoqli-sarimsoqli souz",
    "en": "Creamy garlic sauce"
  },
  "Японская говядина абсолютного класса": {
    "uz": "Oliy darajali yapon mol go'shti",
    "en": "Top-grade Japanese beef"
  },
  "А5 — наивысший класс": {
    "uz": "A5 — eng oliy daraja",
    "en": "A5 — the highest grade"
  },
  "Лобстер": {
    "uz": "Lobster",
    "en": "Lobster"
  },
  "Дорадо": {
    "uz": "Dorado",
    "en": "Dorado"
  },
  "Сибас": {
    "uz": "Sibas",
    "en": "Sea bass"
  },
  "Грибы шиитаке": {
    "uz": "Shiitake qo'ziqorini",
    "en": "Shiitake mushrooms"
  },
  "Кунжутное масло": {
    "uz": "Kunjut moyi",
    "en": "Sesame oil"
  },
  "Фаланга камчатского краба": {
    "uz": "Kamchatka qisqichbaqasi oyog'i",
    "en": "King crab leg"
  },
  "Краб камчатский": {
    "uz": "Kamchatka qisqichbaqasi",
    "en": "King crab"
  },
  "Чука": {
    "uz": "Chuka",
    "en": "Chuka salad"
  },
  "Бобы эдамаме": {
    "uz": "Edamame loviyasi",
    "en": "Edamame beans"
  },
  "Трюфельное масло": {
    "uz": "Tryufel moyi",
    "en": "Truffle oil"
  },
  "Морская соль": {
    "uz": "Dengiz tuzi",
    "en": "Sea salt"
  },
  "Устрица в сливочном соусе": {
    "uz": "Qaymoqli sousdagi ustritsa",
    "en": "Oyster in cream sauce"
  },
  "Спайси соус": {
    "uz": "Spaysi souz",
    "en": "Spicy sauce"
  },
  "Креветка": {
    "uz": "Krevetka",
    "en": "Shrimp"
  },
  "Устрица": {
    "uz": "Ustritsa",
    "en": "Oyster"
  },
  "Соус": {
    "uz": "Souz",
    "en": "Sauce"
  },
  "Каперсы": {
    "uz": "Kapers",
    "en": "Capers"
  },
  "Красная икра": {
    "uz": "Qizil ikra",
    "en": "Red caviar"
  },
  "Перепелиные яйца": {
    "uz": "Bedana tuxumi",
    "en": "Quail eggs"
  },
  "Нори": {
    "uz": "Nori",
    "en": "Nori"
  },
  "Сыр кремета": {
    "uz": "Kremetta pishlog'i",
    "en": "Cremette cheese"
  },
  "Унаги": {
    "uz": "Unagi",
    "en": "Unagi"
  },
  "Авокадо": {
    "uz": "Avokado",
    "en": "Avocado"
  },
  "Фаланги краба": {
    "uz": "Qisqichbaqa oyoqlari",
    "en": "Crab legs"
  },
  "Икра тобико": {
    "uz": "Tobiko ikrasi",
    "en": "Tobiko caviar"
  },
  "Японский майонез": {
    "uz": "Yapon mayonezi",
    "en": "Japanese mayonnaise"
  },
  "Вагю А5": {
    "uz": "Vagyu A5",
    "en": "Wagyu A5"
  },
  "Чёрная икра": {
    "uz": "Qora ikra",
    "en": "Black caviar"
  },
  "Тобика": {
    "uz": "Tobiko",
    "en": "Tobiko"
  },
  "Сыр гауда": {
    "uz": "Gauda pishlog'i",
    "en": "Gouda cheese"
  },
  "Угорь": {
    "uz": "Ilonbaliq",
    "en": "Eel"
  },
  "Икра": {
    "uz": "Ikra",
    "en": "Caviar"
  },
  "Рыба угорь": {
    "uz": "Ilonbaliq",
    "en": "Eel"
  },
  "Манго соус": {
    "uz": "Mango sousi",
    "en": "Mango sauce"
  },
  "Тунец аками": {
    "uz": "Akami tunetsi",
    "en": "Akami tuna"
  },
  "Тунец": {
    "uz": "Tunets",
    "en": "Tuna"
  },
  "Тунец оторо": {
    "uz": "Otoro tunetsi",
    "en": "Otoro tuna"
  },
  "Соус терияки": {
    "uz": "Teriyaki sousi",
    "en": "Teriyaki sauce"
  },
  "Аками": {
    "uz": "Akami",
    "en": "Akami"
  },
  "Гункан чука": {
    "uz": "Chuka gunkan",
    "en": "Chuka gunkan"
  },
  "Васаби": {
    "uz": "Vasabi",
    "en": "Wasabi"
  },
  "Имбирь": {
    "uz": "Zanjabil",
    "en": "Ginger"
  },
  "Унаги соус": {
    "uz": "Unagi sousi",
    "en": "Unagi sauce"
  },
  "Оторо": {
    "uz": "Otoro",
    "en": "Otoro"
  },
  "30 ml": {
    "uz": "30 ml",
    "en": "30 ml"
  },
  "60 ml": {
    "uz": "60 ml",
    "en": "60 ml"
  },
  "200 ml": {
    "uz": "200 ml",
    "en": "200 ml"
  },
  "250 ml": {
    "uz": "250 ml",
    "en": "250 ml"
  },
  "350 ml": {
    "uz": "350 ml",
    "en": "350 ml"
  },
  "280 ml": {
    "uz": "280 ml",
    "en": "280 ml"
  },
  "100 ml": {
    "uz": "100 ml",
    "en": "100 ml"
  },
  "450 ml": {
    "uz": "450 ml",
    "en": "450 ml"
  },
  "300 ml": {
    "uz": "300 ml",
    "en": "300 ml"
  },
  "1 литр": {
    "uz": "1 litr",
    "en": "1 L"
  },
  "Безалкогольный фреш-микс": {
    "uz": "Alkogolsiz fresh-miks",
    "en": "Non-alcoholic fresh mix"
  },
  "Ароматная мята": {
    "uz": "Xushbo'y yalpiz",
    "en": "Aromatic mint"
  },
  "Сочный лаймовый акцент": {
    "uz": "Sersuv laym ta'mi",
    "en": "Juicy lime accent"
  },
  "Тропический микс": {
    "uz": "Tropik miks",
    "en": "Tropical mix"
  },
  "Лемонграсс": {
    "uz": "Limon o'ti",
    "en": "Lemongrass"
  },
  "Апельсиновый сок": {
    "uz": "Apelsin sharbati",
    "en": "Orange juice"
  },
  "Бабл гам": {
    "uz": "Babl gam",
    "en": "Bubble gum"
  },
  "Б/а джин": {
    "uz": "Alkogolsiz jin",
    "en": "Non-alcoholic gin"
  },
  "Сочный манго": {
    "uz": "Sersuv mango",
    "en": "Juicy mango"
  },
  "Спелая смородина": {
    "uz": "Pishgan qora smorodina",
    "en": "Ripe blackcurrant"
  },
  "Ваниль": {
    "uz": "Vanil",
    "en": "Vanilla"
  },
  "Бодрящий тоник": {
    "uz": "Tetiklantiruvchi tonik",
    "en": "Refreshing tonic"
  },
  "Свежий грейпфрут": {
    "uz": "Yangi greypfrut",
    "en": "Fresh grapefruit"
  },
  "Лесные ягоды": {
    "uz": "O'rmon rezavorlari",
    "en": "Forest berries"
  },
  "Двойной эспрессо": {
    "uz": "Qo'sh espresso",
    "en": "Double espresso"
  },
  "Спелый банан": {
    "uz": "Pishgan banan",
    "en": "Ripe banana"
  },
  "Сливочно-банановая пена": {
    "uz": "Qaymoqli-bananli ko'pik",
    "en": "Creamy banana foam"
  },
  "Карамелизованный банан": {
    "uz": "Karamellangan banan",
    "en": "Caramelized banana"
  },
  "Ароматный чёрный чай": {
    "uz": "Xushbo'y qora choy",
    "en": "Aromatic black tea"
  },
  "Финик": {
    "uz": "Xurmo",
    "en": "Date"
  },
  "Сливочно-карамельная пена": {
    "uz": "Qaymoqli-karamelli ko'pik",
    "en": "Creamy caramel foam"
  },
  "Грецкий орех": {
    "uz": "Yong'oq",
    "en": "Walnut"
  },
  "Молочно-кофейный напиток": {
    "uz": "Sutli-kofeli ichimlik",
    "en": "Milk coffee drink"
  },
  "Фисташковый акцент": {
    "uz": "Pista ta'mi",
    "en": "Pistachio accent"
  },
  "Голландское какао": {
    "uz": "Golland kakaosi",
    "en": "Dutch cocoa"
  },
  "Ириска": {
    "uz": "Iriska",
    "en": "Toffee"
  },
  "Крошка из печенья": {
    "uz": "Pechenye ushog'i",
    "en": "Cookie crumble"
  },
  "Премиальное какао": {
    "uz": "Premium kakao",
    "en": "Premium cocoa"
  },
  "Сливочные ноты": {
    "uz": "Qaymoqli ohang",
    "en": "Creamy notes"
  },
  "Холодный чай": {
    "uz": "Sovuq choy",
    "en": "Iced tea"
  },
  "Каркаде и чёрный лист": {
    "uz": "Karkade va qora choy bargi",
    "en": "Hibiscus and black tea leaf"
  },
  "Цитрусы": {
    "uz": "Sitrus mevalari",
    "en": "Citrus"
  },
  "Клубника": {
    "uz": "Qulupnay",
    "en": "Strawberry"
  },
  "Малина": {
    "uz": "Malina",
    "en": "Raspberry"
  },
  "Свежая мята": {
    "uz": "Yangi yalpiz",
    "en": "Fresh mint"
  },
  "Классический айран": {
    "uz": "Klassik ayron",
    "en": "Classic ayran"
  },
  "Вишня": {
    "uz": "Olcha",
    "en": "Cherry"
  },
  "Домашний компот": {
    "uz": "Uyda tayyorlangan kompot",
    "en": "Homemade compote"
  },
  "Настой шиповника": {
    "uz": "Namatak damlamasi",
    "en": "Rosehip infusion"
  },
  "Яблоко": {
    "uz": "Olma",
    "en": "Apple"
  },
  "Юдзу": {
    "uz": "Yudzu",
    "en": "Yuzu"
  },
  "Ежевика": {
    "uz": "Maymunjon",
    "en": "Blackberry"
  },
  "Персик": {
    "uz": "Shaftoli",
    "en": "Peach"
  },
  "Груша": {
    "uz": "Nok",
    "en": "Pear"
  },
  "Манго": {
    "uz": "Mango",
    "en": "Mango"
  },
  "Маракуйя": {
    "uz": "Marakuyya",
    "en": "Passion fruit"
  },
  "Свежевыжатый гранат": {
    "uz": "Yangi siqilgan anor",
    "en": "Freshly squeezed pomegranate"
  },
  "Свежевыжатое яблоко": {
    "uz": "Yangi siqilgan olma",
    "en": "Freshly squeezed apple"
  },
  "Свежевыжатая морковь": {
    "uz": "Yangi siqilgan sabzi",
    "en": "Freshly squeezed carrot"
  },
  "Свежевыжатый апельсин": {
    "uz": "Yangi siqilgan apelsin",
    "en": "Freshly squeezed orange"
  },
  "Огурец": {
    "uz": "Bodring",
    "en": "Cucumber"
  },
  "Ягодный чай": {
    "uz": "Rezavorli choy",
    "en": "Berry tea"
  },
  "Чёрный лист": {
    "uz": "Qora choy bargi",
    "en": "Black tea leaf"
  },
  "Кислинка лесных ягод": {
    "uz": "O'rmon rezavorlarining nordonligi",
    "en": "Forest berry tartness"
  },
  "Цитрусовый чай": {
    "uz": "Sitrusli choy",
    "en": "Citrus tea"
  },
  "Свежая морковь": {
    "uz": "Yangi sabzi",
    "en": "Fresh carrot"
  },
  "Мёд": {
    "uz": "Asal",
    "en": "Honey"
  },
  "Эрл Грей": {
    "uz": "Erl Grey",
    "en": "Earl Grey"
  },
  "Цветущая сакура": {
    "uz": "Gullagan sakura",
    "en": "Cherry blossom"
  },
  "Сочный персик": {
    "uz": "Sersuv shaftoli",
    "en": "Juicy peach"
  },
  "Цитрусовая кислинка": {
    "uz": "Sitrus nordonligi",
    "en": "Citrus tartness"
  },
  "Фруктово-ягодный микс": {
    "uz": "Meva-rezavor miksi",
    "en": "Fruit and berry mix"
  },
  "Гуава": {
    "uz": "Guava",
    "en": "Guava"
  },
  "Садовые ягоды": {
    "uz": "Bog' rezavorlari",
    "en": "Garden berries"
  },
  "Цитрус": {
    "uz": "Sitrus",
    "en": "Citrus"
  }
};

/** Tarjimani topadi, topilmasa ruscha variantini qaytaradi */
export function translate(dict, value, lang) {
  if (lang === 'ru') return value;
  return dict[value]?.[lang] || value;
}

export default { CATEGORIES, DISH_NAMES, INGREDIENTS, translate };
