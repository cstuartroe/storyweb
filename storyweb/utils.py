from markdown import markdown
from bs4 import BeautifulSoup
import nltk
import re

CLITICS = {"'m", "'ll", "n't", "'d", "'re", "'s", "'ve"}


try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')


def markdown_text(s):
    return BeautifulSoup(markdown(s), features='html.parser').text


def word_count(s):
    tokens = nltk.tokenize.word_tokenize(markdown_text(s))
    actual_words = [t for t in tokens if (t not in CLITICS and re.search("[a-zA-Z]", t))]
    return len(actual_words)
