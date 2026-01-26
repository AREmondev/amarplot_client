"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useTranslation } from "react-i18next"
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Upload,
  Save,
  Trash2,
  LogOut
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import DashboardSidebar from "../components/dashboard-sidebar"

export default function SettingsPage() {
  const { t } = useTranslation(['common', 'forms'])
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  
  const [activeTab, setActiveTab] = useState('profile')
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    bio: "",
    location: ""
  })
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appNotifications: true,
    marketingEmails: false
  })
  
  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Handle notification toggle
  const handleNotificationToggle = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }
  
  // Handle profile save
  const handleSaveProfile = () => {
    toast({
      title: t('forms:settings.profile_updated'),
      description: t('forms:settings.profile_updated_desc')
    })
  }
  
  // Handle password change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: t('forms:settings.password_updated'),
      description: t('forms:settings.password_updated_desc')
    })
  }
  
  // If not authenticated, redirect to login
  if (!session) {
    router.push('/auth')
    return null
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <DashboardSidebar activePage="settings" />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('forms:settings.account_settings')}</h1>
            <p className="text-gray-600 mt-1">{t('forms:settings.manage_account_desc')}</p>
          </div>
          
          {/* Settings Tabs */}
          <Tabs defaultValue="profile" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                {t('forms:settings.profile')}
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="h-4 w-4 mr-2" />
                {t('forms:settings.security')}
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                {t('forms:settings.notifications')}
              </TabsTrigger>
              <TabsTrigger value="privacy">
                <Shield className="h-4 w-4 mr-2" />
                {t('forms:settings.privacy')}
              </TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('forms:settings.profile_information')}</CardTitle>
                  <CardDescription>
                    {t('forms:settings.update_personal_info')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={(session?.user as any)?.image || ""} alt={session?.user?.name || "User"} />
                      <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">{t('forms:settings.profile_picture')}</h3>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          {t('common:upload')}
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t('common:remove')}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Profile Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('forms:settings.full_name')}</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('forms:settings.email_address')}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('forms:settings.phone_number')}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">{t('forms:settings.location')}</Label>
                      <Input
                        id="location"
                        name="location"
                        value={profileForm.location}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">{t('forms:settings.bio')}</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profileForm.bio}
                        onChange={handleProfileChange}
                        rows={4}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSaveProfile}>
                    <Save className="h-4 w-4 mr-2" />
                    {t('common:save_changes')}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Security Tab */}
            <TabsContent value="security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('forms:settings.security_settings')}</CardTitle>
                  <CardDescription>
                    {t('forms:settings.manage_password_security')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Change Password */}
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <h3 className="text-lg font-medium">{t('forms:settings.change_password')}</h3>
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">{t('forms:settings.current_password')}</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{t('forms:settings.new_password')}</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t('forms:settings.confirm_new_password')}</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      {t('forms:settings.update_password')}
                    </Button>
                  </form>
                  
                  <Separator />
                  
                  {/* Two-Factor Authentication */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{t('forms:settings.two_factor_auth')}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('forms:settings.two_factor_auth')}</p>
                        <p className="text-sm text-gray-500">{t('forms:settings.extra_security_layer')}</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Session Management */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{t('forms:settings.active_sessions')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{t('forms:settings.current_session')}</p>
                          <p className="text-sm text-gray-500">Dhaka, Bangladesh • Chrome on Windows</p>
                        </div>
                        <Badge>{t('common:active')}</Badge>
                      </div>
                    </div>
                    <Button variant="outline" className="text-red-500 hover:text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('forms:settings.sign_out_all_devices')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('forms:settings.notification_preferences')}</CardTitle>
                  <CardDescription>
                    {t('forms:settings.manage_notifications_desc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('forms:settings.email_notifications')}</p>
                        <p className="text-sm text-gray-500">{t('forms:settings.receive_email_notifications')}</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('forms:settings.sms_notifications')}</p>
                        <p className="text-sm text-gray-500">{t('forms:settings.receive_sms_notifications')}</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={() => handleNotificationToggle('smsNotifications')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('forms:settings.app_notifications')}</p>
                        <p className="text-sm text-gray-500">{t('forms:settings.receive_app_notifications')}</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.appNotifications}
                        onCheckedChange={() => handleNotificationToggle('appNotifications')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('forms:settings.marketing_emails')}</p>
                        <p className="text-sm text-gray-500">{t('forms:settings.receive_marketing_emails')}</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={() => handleNotificationToggle('marketingEmails')}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={() => {
                    toast({
                      title: t('forms:settings.notification_settings_updated'),
                      description: t('forms:settings.notification_preferences_saved')
                    })
                  }}>
                    <Save className="h-4 w-4 mr-2" />
                    {t('forms:settings.save_preferences')}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Privacy Tab */}
            <TabsContent value="privacy" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('forms:settings.privacy_settings')}</CardTitle>
                  <CardDescription>
                    {t('forms:settings.control_privacy_data')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('forms:settings.profile_visibility')}</p>
                        <p className="text-sm text-gray-500">{t('forms:settings.profile_visible_to_users')}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('forms:settings.show_contact_info')}</p>
                        <p className="text-sm text-gray-500">{t('forms:settings.display_contact_on_listings')}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('forms:settings.data_analytics')}</p>
                        <p className="text-sm text-gray-500">{t('forms:settings.collect_usage_data')}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('forms:settings.third_party_sharing')}</p>
                        <p className="text-sm text-gray-500">{t('forms:settings.share_data_partners')}</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{t('forms:settings.data_management')}</h3>
                    <div className="space-y-2">
                      <Button variant="outline">
                        {t('forms:settings.download_my_data')}
                      </Button>
                      <p className="text-xs text-gray-500">{t('forms:settings.get_copy_data')}</p>
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" className="text-red-500 hover:text-red-600">
                        {t('forms:settings.delete_account')}
                      </Button>
                      <p className="text-xs text-gray-500">{t('forms:settings.permanently_delete_account')}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={() => {
                    toast({
                      title: t('forms:settings.privacy_settings_updated'),
                      description: t('forms:settings.privacy_preferences_saved')
                    })
                  }}>
                    <Save className="h-4 w-4 mr-2" />
                    {t('forms:settings.save_settings')}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}