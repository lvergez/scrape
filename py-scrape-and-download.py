#!/usr/bin/env python
__author__ = 'Loup'
import mechanize
from BeautifulSoup import BeautifulSoup
import sys

mech = mechanize.Browser()  #create variable mech and store browser in it

mech.set_handle_referer(False)    # allow everything to be written to
mech.set_handle_robots(False)   # no robots
mech.set_handle_refresh(True)  # can sometimes hang without this
mech.set_handle_redirect(True)
mech.addheaders = [('User-Agent', 'Mozilla/5.0 (Linux; U; Android 2.3.4; en-us; T-Mobile myTouch 3G Slide Build/GRI40) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1'),
                    ('Keep-Alive', '115'),
                    ('Connection', 'keep-alive'),
                    ('Cache-Control', 'max-age=0'),
                    ('Referer', 'http://www.brusselsairport.be/en/passngr/flinfo/arrivs/nojs/')]

url = "http://flightinfo.brusselsairport.be/en/arrivals.html"
page = mech.open(url) #page is the variable containing the page - funtion .open on the page
html = page.read() #html is the variable. machinize .read eturns the whole html
soup = BeautifulSoup(html)
pretty = soup.prettify()
#print pretty
globvar = 0
f = open('result.csv','w+')
table = soup.find(lambda tag: tag.name=='table' and tag.has_key('id') and tag['id']=="flight")
rows = table.findAll(lambda tag: tag.name=='tr')
myarray ={}
#print rows
for index, row in enumerate(rows): #use enumerate to pop index as well
	clazz = row.get('class',[]) #skip the odd header for new dates
	if clazz == 'dt':
		col = row.findAll('td')
		flightdate = col[0].string[-10:] #let's add the date while we're at skipping ugly HTML tables
	if clazz != 'dt':
		col = row.findAll('td')
		time = col[0].string
		flight = col[1].string
		origin = col[2].string
		status = col[3].div.string
		arrival = col[4].string
		airline = flight.strip('0123456789*')
		flightnumber = flight.strip('AZERTYUIOPQSDFGHJKLMWXCVBN*')
		print index, time,flight,origin,status,arrival,airline," ",flightnumber,flightdate
		infostring = index ,";", time ,";" , flight, ";" , origin , ";" , status , ";" , arrival , ";" , airline , ";" , flightnumber ,  ";", flightdate
		f.write(str(infostring))
		myarray[index] ={'date' : flightdate , 'flight' : flight, 'carrier': airline, 'flightnumber' : flightnumber , 'origin':origin,'status':status, 'landing':arrival  }


print myarray[1]
f.close()







#f = open('result.html','w')
#s = str(pretty)
#print s
#f.write(s)
#f.close()
