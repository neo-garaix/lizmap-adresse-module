<?php
/**
 * @author    Laurent Jouanneau
 * @copyright 2022 3liz
 *
 * @see      http://3liz.com
 *
 * @license    Mozilla Public Licence
 */
class adresseModuleInstaller extends \Jelix\Installer\Module\Installer
{
    public function install(\Jelix\Installer\Module\API\InstallHelpers $helpers)
    {
        //if ($this->firstDbExec())
        //    $this->execSQLScript('sql/install');

        /*if ($this->firstExec('acl2')) {
            jAcl2DbManager::addSubject('my.subject', 'adresse~acl.my.subject', 'subject.group.id');
            jAcl2DbManager::addRight('admins', 'my.subject'); // for admin group
        }
        */
    }
}
