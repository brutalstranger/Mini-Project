from BeautifulSoup import BeautifulSoup


path = r"C:\Users\yoav\Desktop\ben_yehuda\output\adina\megilat.txt"

with open(path) as text:

    for word in text:
        word_length = len(word)
        if word_length > 5:
            print word
