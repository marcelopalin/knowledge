# INSTALE O WAMPSERVER 64 3.0.2

- MySQL 8.0.18
- MariaDB
- PHP 7.3 e 7.4

Teremos que desativar

# DEFININDO A SENHA DO ROOT DO MYSQL

1) Vá no painel do MySQL (Wampserver) e abra o MySQL Console - pedirá senha, basta dar Enter

- Para definir a senha utilize:

mysql> SET PASSWORD for 'root'@'localhost' = password('enteryourpassword');
mysql> SET PASSWORD for 'root'@'127.0.0.1' = password('enteryourpassword');
mysql> SET PASSWORD for 'root'@'::1' = password('enteryourpassword');

Na versão atual do WampServer wampserver3.2.0_x64.exe (27 fev 2020)
temos o MariaDB e o MySQL (que solicitamos para instalar no momento da instalação do Wampserver)
e ele coloca o MySQL (Oracle) na porta 3308, veja como alterar isto:

ALTERANDO A PORTA DO MYSQL PORT 3308 -> 3306

No php.ini altere para a porta 3306.

Depois altere C:\wamp64\apps\phpmyadmin4.9.2\config.inc.php

    if($mariaFirst) $i++;
    $cfg['Servers'][$i]['verbose'] = 'MySQL';
    $cfg['Servers'][$i]['host'] = '127.0.0.1';
    $cfg['Servers'][$i]['port'] = '3306';// $wampConf['mysqlPortUsed'];
    $cfg['Servers'][$i]['extension'] = 'mysqli';
    $cfg['Servers'][$i]['auth_type'] = 'config'; //cookies
    $cfg['Servers'][$i]['user'] = 'root';
    $cfg['Servers'][$i]['password'] = 'enteryourpassword';


MYSQL PORT 3306 -> 3308

No php.ini altere para a porta 3308.


MYSQL PATH

Coloque o MYSQL e o PHP no PATH do windows:
C:\wamp64\bin\mysql\mysql8.0.18\bin

PHP PATH = C:\wamp64\bin\php\php7.3.12

XDEBUG

Acesse a página e copie seu conteúdo: 
http://localhost/?phpinfo=-1

Cole em https://xdebug.org/wizard.php

Clique em Analisar e ele imprimirá as seguntes instruções:

Summary
* Xdebug installed: 2.8.0
* Server API: Apache 2.0 Handler
* Windows: yes - Compiler: MS VC 15 - Architecture: x64
* Zend Server: no
* PHP Version: 7.3.12
* Zend API nr: 320180731
* PHP API nr: 20180731
* Debug Build: no
* Thread Safe Build: yes
* OPcache Loaded: yes
* Configuration File Path: C:\WINDOWS
* Configuration File: C:\wamp64\bin\apache\apache2.4.41\bin\php.ini
* Extensions directory: c:\wamp64\bin\php\php7.3.12\ext

Instructions
1. Download php_xdebug-2.9.2-7.3-vc15-x86_64.dll
2. Move the downloaded file to c:\wamp64\bin\php\php7.3.12\ext
3. Update C:\wamp64\bin\apache\apache2.4.41\bin\php.ini and change the line
zend_extension = c:\wamp64\bin\php\php7.3.12\ext\php_xdebug-2.9.2-7.3-vc15-x86_64.dll
Make sure that zend_extension = c:\wamp64\bin\php\php7.3.12\ext\php_xdebug-2.9.2-7.3-vc15-x86_64.dll is below the line for OPcache.
4. Restart the webserver


Abra o arquivo php.ini indicado e vá até o final dele. Você encontrará as seguintes linhas que JÁ ESTÃO ABAIXO DA CONFIGURAÇÃO OPCache! 

```ini
; Local Variables:
; tab-width: 4
; End:
; XDEBUG Extension
[xdebug]
zend_extension="c:/wamp64/bin/php/php7.3.12/zend_ext/php_xdebug-2.8.0-7.3-vc15-x86_64.dll"
xdebug.remote_enable = off
xdebug.profiler_enable = off
xdebug.profiler_enable_trigger = Off
xdebug.profiler_output_name = cachegrind.out.%t.%p
xdebug.profiler_output_dir ="c:/wamp64/tmp"
xdebug.show_local_vars=0
```

Atualizando/Alterando as configurações

```ini
[xdebug]
;zend_extension="c:/wamp64/bin/php/php7.3.12/zend_ext/php_xdebug-2.8.0-7.3-vc15-x86_64.dll"
zend_extension = "c:/wamp64/bin/php/php7.3.12/ext/php_xdebug-2.9.2-7.3-vc15-x86_64.dll"
xdebug.remote_enable = on
xdebug.profiler_enable = off
xdebug.profiler_enable_trigger = Off
xdebug.profiler_output_name = cachegrind.out.%t.%p
xdebug.profiler_output_dir ="c:/wamp64/tmp"
xdebug.show_local_vars=0
xdebug.remote_host=127.0.0.1
xdebug.remote_port=9000

```
PhpAdmin - configurando para acesso

2) Edite o arquivo
C:\wamp64\apps\phpmyadmin4.9.2\config.inc.php

Defina na Seção:

if($wampConf['SupportMySQL'] == 'on') {
/* Server: localhost [1] */
	$i++;
	if($mariaFirst) $i++;
	$cfg['Servers'][$i]['verbose'] = 'MySQL';
	$cfg['Servers'][$i]['host'] = '127.0.0.1';
	$cfg['Servers'][$i]['port'] = '3306';// $wampConf['mysqlPortUsed'];
	$cfg['Servers'][$i]['extension'] = 'mysqli';
	$cfg['Servers'][$i]['auth_type'] = 'config';
	$cfg['Servers'][$i]['user'] = 'root';
	$cfg['Servers'][$i]['password'] = 'vh3mqxi';

# PERDEU A SENHA DO ROOT! 

Abra o Painel do Wampserver e dê um STOP no serviço! 

ou faça:You can do so via:

A) Command Line – Run cmd.exe (permissions elevated: right click it, select ‘Run as admin’), within it execute: “net stop MySQL” OR “net stop MySQL”

B) Window Services Manager – Run services.msc, select MySQL Service, stop it.

C) WampDeveloper’s System Tab – Select MySQL Service, stop it.Abra pelo painel do wampserver o my.ini e descomente a linha ;skip-grant-tables (remova o ;)

[wampmysqld64]
skip-grant-tables
default_authentication_plugin=mysql_native_password
port =3306
socket = /tmp/mysql.sock
key_buffer_size = 256M
max_allowed_packet = 64M


Reinicie o serviço! Abra o prompt de comando e digite: 

```
mysql -u root
```

Execute os comandos:

UPDATE mysql.user SET Password=PASSWORD('enteryourpassword') WHERE User='root';
FLUSH PRIVILEGES;

mysql> SET PASSWORD FOR 'root'@'localhost' = 'enteryourpassword';
