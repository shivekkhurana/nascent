function [nascentness] = main(tileUrls)
    nascents = cellfun(@(tileUrl) processor(tileUrl), tileUrls);
    nascentness = sum(nascents)/length(nascents);
end