 <?
 $url ='https://api.coinmarketcap.com/v1/ticker/';
 
   $c = curl_init();
    curl_setopt($c, CURLOPT_URL, $url);
    curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($c, CURLOPT_ENCODING, 'gzip,deflate');
    curl_setopt($c, CURLINFO_HEADER_OUT, true);
    $headers = [
        'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding: gzip, deflate, sdch',
        'Accept-Language: vi,en-US;q=0.8,en;q=0.6',
        'Cache-Control: max-age=0',
        'Connection: keep-alive',
        'Cookie: __cfduid=d9f52c3f5acc12f1dc38a2f65cd1dda401501427687',              
        'User-Agent: Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    ];
    curl_setopt($c, CURLOPT_HTTPHEADER, $headers);
    $data = curl_exec($c);
	echo $data;
 ?>