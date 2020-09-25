from selenium import webdriver
driver = webdriver.Chrome('./chromedriver')
driver.get('https://www.alimi.or.kr/api/a/vacant/selectApiVacant.do') // 스크래핑 해올 주소
table = driver.find_element_by_class_name('search_list')
tableBody = table.find_element_by_tag_name('tbody')
tableRows = tableBody.find_elements_by_tag_name('tr')
for index, row in enumerate(tableRows):
    if index != 0:
        typeLand = row.find_elements_by_tag_name('td')[1].text
        address = row.find_elements_by_tag_name('td')[2].text
        pay = row.find_elements_by_tag_name('td')[3].text
        size = row.find_elements_by_tag_name('td')[4].text
        jimk = row.find_elements_by_tag_name('td')[5].text
        print(typeLand,  address, pay, size, jimk)
