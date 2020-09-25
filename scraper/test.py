from selenium import webdriver
driver = webdriver.Chrome('./chromedriver')
driver.get('https://www.asiae.co.kr/article/2020072115182367372')
# //*[@id="container"]/div[3]/div[2]/div[2]/h3
title = driver.find_element_by_xpath(
    '//*[@id="container"]/div[3]/div[2]/div[2]/h3').text
subject = driver.find_element_by_xpath(
    '//*[@id="txt_area"]/div[2]/h4').text
print(title)
print(subject)
