import random

from fastapi import FastAPI, Depends
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import APIKeyHeader
from selectorlib import Extractor
import requests
import json
from time import sleep

app = FastAPI()

e = Extractor.from_yaml_file('search_results.yml')

API_KEY = "2b7e151628aed2a6abf7158809cf4f3c"
API_KEY_NAME = "access_token"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)


async def get_api_key(api_key_header: str = Depends(api_key_header)):
    if api_key_header == API_KEY:
        return api_key_header
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="No tiene acceso"
        )


@app.get("/{search}")
async def root(search: str, api_key: str = Depends(get_api_key)):
    # product_data = []
    amazon_url = "https://www.amazon.com/s?k=" + search
    proxies_list = open("rotating_ip.txt", "r").read().strip().split("\n")
    data = scrape(amazon_url, )
    products = []
    if data:
        for product in data['products']:
            print("Product: %s" % product['title'])
            product['search_url'] = amazon_url
            products.append(product)
        return products


@app.get("/hola/{texto}")
def root(texto: str):
    print(texto)


def scrape(url, proxy):
    headers = {
        'dnt': '1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) '
                      'Chrome/83.0.4103.61 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,'
                  'application/signed-exchange;v=b3;q=0.9',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-user': '?1',
        'sec-fetch-dest': 'document',
        'referer': 'https://www.amazon.com/',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
    }

    # Download the page using requests
    print("Downloading %s" % url)
    r = requests.get(url, headers=headers)
    # Simple check to check if page was blocked (Usually 503)
    if r.status_code > 500:
        if "To discuss automated access to Amazon data please contact" in r.text:
            print("Page %s was blocked by Amazon. Please try using better proxies\n" % url)
        else:
            print("Page %s must have been blocked by Amazon as the status code was %d" % (url, r.status_code))
        return None
    # Pass the HTML of the page and create
    return e.extract(r.text)
