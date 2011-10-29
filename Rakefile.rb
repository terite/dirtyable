task :test do 
  sh "nodeunit test*"
end
task :default => :test